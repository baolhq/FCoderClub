const express = require("express");
const challengeRouter = express.Router();

// TODO: Get data from database and show challenges
challengeRouter.get("/", (req, res) => {
  if (req.user) {
    res.render("coming-soon", {
      isAnonymous: false,
      avatar: req.user.photos[0].value,
      displayName: req.user.displayName,
      username: req.user.username,
    });
  } else
    res.render("coming-soon", {
      isAnonymous: true,
      avatar: "https://i.imgur.com/5ZkGR2I.jpg",
      displayName: "Anonymous",
      username: "unknow",
    });
});

module.exports = challengeRouter;
