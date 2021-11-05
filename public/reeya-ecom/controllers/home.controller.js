const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  return res.render("ejs/home", {});
});

router.get("/user/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  let name = user.name;
  return res.render("ejs/home", { name });
});

module.exports = router;
