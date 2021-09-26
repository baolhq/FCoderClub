// For development only
// require("dotenv").config();

// This line is required for Github authentication to work
require("https").globalAgent.options.rejectUnauthorized = false;

const express = require("express");
const session = require("express-session");
const path = require("path");
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const db = require("./models/db");
const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `http://localhost:${
        process.env.PORT || 5000
      }/auth/github/callback`,
    },
    function (accessToken, refreshToken, profile, cb) {
      cb(null, profile);
    }
  )
);

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "/public"));

let articleRouter = require("./routers/articleRouter");
app.use("/", articleRouter);

let accountRouter = require("./routers/accountRouter");
app.use("/account", accountRouter);

let questionRouter = require("./routers/questionRouter");
app.use("/questions", questionRouter);

let challengeRouter = require("./routers/challengeRouter");
app.use("/challenges", challengeRouter);

// Authentication
app.get("/auth/github", passport.authenticate("github"));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    const snapshot = await db
      .collection("users")
      .where("username", "==", req.user.username)
      .get();

    if (snapshot.empty) {
      const firestoreResult = await db.collection("users").add({
        username: req.user.username,
        questionsAsked: 0,
        questionsAnswered: 0,
        rankScores: 0,
        reputations: 0,
      });
    }

    res.redirect("/");
  }
);
app.get("/auth/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.get("/contact", (req, res) => {
  if (req.user) {
    res.render("contact", {
      isAnonymous: false,
      avatar: req.user.photos[0].value,
      displayName: req.user.displayName,
      username: req.user.username,
    });
  } else
    res.render("contact", {
      isAnonymous: true,
      avatar: "https://i.imgur.com/5ZkGR2I.jpg",
      displayName: "Anonymous",
      username: "unknow",
    });
});

// 404 Not Found page
app.get("*", (req, res) => {
  if (req.user) {
    res.render("not-found", {
      isAnonymous: false,
      avatar: req.user.photos[0].value,
      displayName: req.user.displayName,
      username: req.user.username,
    });
  } else
    res.render("not-found", {
      isAnonymous: true,
      avatar: "https://i.imgur.com/5ZkGR2I.jpg",
      displayName: "Anonymous",
      username: "unknow",
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
