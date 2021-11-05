const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  return res.render("ejs/login", {});
});

module.exports = router;
