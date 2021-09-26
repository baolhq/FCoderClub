const express = require("express");
const questionRouter = express.Router();

// TODO: Get data from database and show questions
questionRouter.get("/", (req, res) => {
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

// TODO: Get data from database and show question
// questionRouter.get("/:slug", (req, res) => {
//   if (req.user) {
//     res.render("question", {
//       isAnonymous: false,
//       avatar: req.user.photos[0].value,
//       displayName: req.user.displayName,
//       username: req.user.username,
//     });
//   } else
//     res.render("question", {
//       isAnonymous: true,
//       avatar: "https://i.imgur.com/5ZkGR2I.jpg",
//       displayName: "Anonymous",
//       username: "unknow",
//     });
// });

module.exports = questionRouter;
