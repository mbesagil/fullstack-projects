import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password != confirmPassword)
      return res.status(404).send({ error: "Passwords not matched" });

    const user = await User.findOne({ username });
    if (user) return res.status(409).send({ error: "User Already Exist" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      gender,
      username,
      password: hashedPassword,
      profilePic: gender == "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(201).send({
        message: `User ${username} Create`,
        data: { _id: newUser._id, username: newUser.username },
      });
    } else {
      if (user) return res.status(404).send({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(404).send({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPAsswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPAsswordCorrect) {
      return res.status(404).send({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).send({
      _id: user._id,
      username: user.username,
      fullName: user.fullName,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(404).send({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error :>> ", error);
    return res.status(404).send({ error: "Internal Server Error" });
  }
};

export { signup, logout, login };
