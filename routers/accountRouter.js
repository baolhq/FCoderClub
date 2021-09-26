const express = require("express");
const accountRouter = express.Router();

accountRouter.get("/", (req, res) => {
  if (req.user) {
    res.render("account", {
      isAnonymous: false,
      avatar: req.user.photos[0].value,
      displayName: req.user.displayName,
      username: req.user.username,
      location: req.user._json.location,
      email: req.user._json.email,
      blog: req.user._json.blog,
      company: req.user._json.company,
      bio: req.user._json.bio,
      userAvatar: req.user._json.avatar_url,
    });
  } else
    res.render("loginRequired", {
      isAnonymous: true,
      avatar: "https://i.imgur.com/5ZkGR2I.jpg",
      displayName: "Anonymous",
      username: "unknow",
    });
});

module.exports = accountRouter;
