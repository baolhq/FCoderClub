const express = require("express");
const articleRouter = express.Router();
const dateFormat = require("../libs/date.format.js");
const db = require("../models/db");

articleRouter.get("/", async (req, res) => {
  const snapshot = await db.collection("posts").get();
  const data = snapshot.docs.map((doc) => doc.data());

  const posts = [];
  data.forEach((p) => {
    let authorAvt =
      p.authorAvt === undefined
        ? "https://i.imgur.com/5ZkGR2I.jpg"
        : p.authorAvt;
    posts.push({
      title: p.title,
      author: p.author,
      slug: p.slug,
      authorAvt: authorAvt,
      desc: p.desc,
      thumbnail: p.thumbnailURL,
      date: dateFormat(new Date(p.timestamp * 1000), "dddd, mmmm dS, yyyy"),
      views: p.views,
    });
  });

  if (req.user) {
    res.render("articles", {
      isAnonymous: false,
      avatar: req.user.photos[0].value,
      displayName: req.user.displayName,
      username: req.user.username,
      posts: posts,
    });
  } else
    res.render("articles", {
      isAnonymous: true,
      avatar: "https://i.imgur.com/5ZkGR2I.jpg",
      displayName: "Anonymous",
      username: "unknow",
      posts: posts,
    });
});

articleRouter.get("/article/:slug", async (req, res) => {
  const snapshot = await db
    .collection("posts")
    .where("slug", "==", req.params.slug)
    .get();

  // If couldn't find any document, return 404 page
  if (!snapshot.size) {
    res.redirect("/");
    return;
  }

  // Increase view count
  await db
    .collection("posts")
    .doc(snapshot.docs[0].id)
    .set(
      {
        views: parseInt(snapshot.docs[0]._fieldsProto.views.integerValue) + 1,
      },
      { merge: true }
    );

  // Push tags to an array
  const tagsArray = [];
  snapshot.docs[0]._fieldsProto.tags.arrayValue.values.forEach((item) => {
    tagsArray.push(item.stringValue);
  });

  // Format date time
  let dateTime = new Date(
    snapshot.docs[0]._fieldsProto.timestamp.integerValue * 1000
  );

  let postContent = {
    title: snapshot.docs[0]._fieldsProto.title.stringValue,
    thumbnail: snapshot.docs[0]._fieldsProto.thumbnailURL.stringValue,
    slug: snapshot.docs[0]._fieldsProto.slug.stringValue,
    date: dateFormat(dateTime, "dddd, mmmm dS, yyyy"),
    author: snapshot.docs[0]._fieldsProto.author.stringValue,
    desc: snapshot.docs[0]._fieldsProto.desc.stringValue,
    content: snapshot.docs[0]._fieldsProto.content.stringValue,
    tags: tagsArray,
  };

  if (req.user) {
    res.render("post", {
      isAnonymous: false,
      avatar: req.user.photos[0].value,
      displayName: req.user.displayName,
      username: req.user.username,
      post: postContent,
    });
  } else
    res.render("post", {
      isAnonymous: true,
      avatar: "https://i.imgur.com/5ZkGR2I.jpg",
      displayName: "Anonymous",
      username: "unknow",
      post: postContent,
    });
});

module.exports = articleRouter;
