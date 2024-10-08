import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    console.log("receiverId :>> ", receiverId);
    console.log("senderId :>> ", senderId);
    console.log("message :>> ", message);

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]); // parallel run

    // socker io func
    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res
      .status(200)
      .send({ message: "Message sent Successfully", data: newMessage });
  } catch (error) {
    console.log("error in sendMessage controller :>> ", error);
    return res.status(404).send({ error: "Internal Server Error " });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages");

    res.status(200).send({ data: conversation?.messages || [] });
  } catch (error) {
    console.log("error in getMessage controller :>> ", error);
    return res.status(404).send({ error: "Internal Server Error " });
  }
};

export { sendMessage, getMessage };
