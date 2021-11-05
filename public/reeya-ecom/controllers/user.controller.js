const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "5de7ffa74fff640a0491bc4fSdfzhszjkbfkjdbkv^$&^*&#*Q#&#&Ysdbjsdbksjbd";

const router = express.Router();

//signup form
router.get("/register", async (req, res) => {
  res.render("ejs/signin");
});

router.get("/login", async (req, res) => {
  res.render("ejs/login");
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();
  if (!user) {
    res.json({ status: "error", error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.username, name: user.name },
      JWT_SECRET
    );
    const userUpdate = await User.findByIdAndUpdate(
      user._id,
      { active: true },
      {
        new: true,
      }
    ).lean();

    const userInfo = jwt.verify(token, JWT_SECRET);

    // localStorage.setItem("token", token);
    return res.json({ status: "ok", data: userInfo });

    // req.session.user = user;
    // res.redirect("/");
  }
  //   res.json({ status: "error", error: "Invalid username/password" });
});

router.post("/register", async (req, res) => {
  const { name, username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }
  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }
  if (plainTextPassword.length < 6) {
    return res.json({
      status: "error",
      error: "Password must be at least 6 characters long",
    });
  }
  const password = await bcrypt.hash(plainTextPassword, 10);
  try {
    const user = await User.create({ name, username, password });
    res.json({ status: "ok", data: user });
  } catch (error) {
    // if (error.code === 11000) {
    res.json({ status: "error", error: error.message });
    // }
    // throw error;
  }
});

module.exports = router;
