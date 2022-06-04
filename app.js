//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

let PORT = process.env.PORT || 3000;

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Global post array
// const posts = [
//   {
//     title: "How to trim a string to N chars in Javascript?"
//     , content: `The substring() method extracts characters, between two indices (positions), from a string, and returns the substring.

//     The substring() method extracts characters from start to end (exclusive).

//     The substring() method does not change the original string.

//     If start is greater than end, arguments are swapped: (4, 1) = (1, 4).

//     Start or end values less than 0, are treated as 0.`
//   },
//   {
//     title: "Road Rash II",
//     content: "Road Rash II is a 1992 racing and vehicular combat game developed and published by Electronic Arts (EA) for the Sega Genesis. The game is centered around a series of motorcycle races throughout the United States that the player must win to advance to higher-difficulty races, while engaging in unarmed and armed combat to hinder the other racers. It is the second installment in the Road Rash series and introduces a split-screen two-player mode for competing human players, nitrous oxide charges on certain bikes, and chains as offensive weapons. EA began development of Road Rash II before the end of the 1991 Christmas season, and the game was released before the end of the 1992 Christmas season. Road Rash II met with critical acclaim and commercial success, with reviewers appreciating the visuals and addition of the multiplayer mode while pointing out the lack of innovation in the fundamental gameplay. A conversion for the Game Boy Color was developed by 3d6 Games and released under the title Road Rash in 2000. The game saw additional releases on the PlayStation Portable compilation title EA Replay in 2006 and on the Sega Genesis Mini in 2019"
//   }
// ];

require("dotenv").config();

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const localDB = "mongodb://localhost:27017/blogDB";
const atlasDB = `mongodb+srv://ashwani:${process.env.MONGODB_PASS}@cluster0.letepvs.mongodb.net/?retryWrites=true&w=majority`;

// Connect to database
mongoose
  .connect(atlasDB)
  .then(() => {
    console.log("Successfully connected to mongoDB");
  })
  .catch((err) => console.log(err));

// Post Schema
const postSchema = mongoose.Schema({
  title: String,
  content: String,
});

// Collection posts
const Post = mongoose.model("Post", postSchema);

app.get("/", (req, res) => {
  // find method
  Post.find({}, (err, posts) => {
    if (!err) {
      res.render("home", {
        homeStartingContent,
        posts,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    aboutContent,
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    contactContent,
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.post("/compose", (req, res) => {
  const newPost = new Post({
    title: req.body.newTitle,
    content: req.body.newPost,
  });
  newPost.save().then(() => res.redirect("/"));
});

app.get("/posts/:postId", (req, res) => {
  const requestedId = req.params.postId;

  Post.findOne({ _id: requestedId }, (err, post) => {
    if (!err) {
      res.render("post", { post });
    } else {
      res.render("page-not-found");
    }
  });

  // posts.forEach(
  //   post => {
  //     const postTitle = _.lowerCase(post.title)

  //     if (postTitle === requestedTitle) {
  //       res.render('post', {
  //         post
  //       })
  //     }
  //   }
  // )
});

app.listen(PORT, function () {
  console.log(`Server started on port ${PORT}`);
});
