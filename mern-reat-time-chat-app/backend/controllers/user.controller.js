import User from "../models/user.model.js";

const getUsers = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedUserId } });

    res.status(200).send({ data: users });
  } catch (error) {
    console.log("error in sendMessage controller :>> ", error);
    return res.status(404).send({ error: "Internal Server Error " });
  }
};

export { getUsers };
