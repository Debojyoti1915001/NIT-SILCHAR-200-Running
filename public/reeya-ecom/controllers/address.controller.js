const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  return res.render("ejs/address", {});
});

module.exports = router;
