const express = require("express");
const { fetchTweet } = require("./controllers/tweetController");

const router = express.Router();

router.get("/:tweetID", fetchTweet);

module.exports = router;
