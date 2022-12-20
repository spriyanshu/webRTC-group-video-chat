const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ReasonPhrases, StatusCodes } = require("http-status-codes");

exports.create = async (req, res) => {
  try {
    res.render("room", { roomId: 123 });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: "Please try again later.",
    });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await User.findOne({ where: { email: email } });

    if (!findUser) {
      return res.status(400).json({ message: "Email does not exist" });
    }
    if (!bcrypt.compareSync(password, findUser.password)) {
      return res.status(400).json({ message: "Password does not match" });
    }
    const token = jwt.sign(
      { id: findUser.id, email: findUser.email, role: findUser.role },
      "key"
    );
    res.cookie("jwt", token, { maxage: 60 * 60 * 24 * 2 });
    return res.status(200).json({ status: "success", token });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ReasonPhrases.INTERNAL_SERVER_ERROR,
      message: "Please try again later.",
    });
  }
};
