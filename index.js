const { Client, GatewayIntentBits, AttachmentBuilder } = require("discord.js");
const { HttpsProxyAgent } = require("https-proxy-agent");
const express = require("express");
require("dotenv").config();
const fs = require("fs");
const tmp = require("tmp");
const { exec } = require("child_process");

// discord bot intents

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// random public proxies to use for each fetch, in order to avoid getting flagged as a bot and ip banned

const proxies = [
  "http://5.196.111.29:20471",
  "http://51.210.19.141:80",
  "http://5.196.111.29:20637",
  "http://23.134.91.53:3128",
  "http://51.158.169.52:29976",
  "http://89.30.96.166:3128",
  "http://92.154.84.215:80",
  "http://51.15.242.202:8888",
  "http://5.196.65.71:3128",
];

function getRandomProxy() {
  const randomIndex = Math.floor(Math.random() * proxies.length);
  return proxies[randomIndex];
}

const app = express();
const port = 3000;

// the x-guest-token value is used to set a valid X-Guest-Token header, it can be reused but it expires after some time that's why we need to fetch it regularly

function getGuestToken() {
  try {
    exec("powershell -File ./getGuestToken.ps1");
    const token = fs
      .readFileSync("./guestToken.txt", "utf8")
      .trim()
      .split("\n")[0];
    return token;
  } catch (error) {
    console.error("Error reading guestToken.txt:", error);
    return null;
  }
}

app.get("/:tweetID", async (req, res) => {
  const tweetID = req.params.tweetID;
  const proxy = getRandomProxy();
  const agent = new HttpsProxyAgent(proxy);
  const guestToken = getGuestToken();
  const response = await fetch(
    `https://api.x.com/graphql/Xl5pC_lBk_gcO2ItU39DQw/TweetResultByRestId?variables=%7B%22tweetId%22%3A%22${tweetID}%22%2C%22withCommunity%22%3Afalse%2C%22includePromotedContent%22%3Afalse%2C%22withVoice%22%3Afalse%7D&features=%7B%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22communities_web_enable_tweet_community_results_fetch%22%3Atrue%2C%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue%2C%22articles_preview_enabled%22%3Atrue%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22rweb_video_timestamps_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22rweb_tipjar_consumption_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D&fieldToggles=%7B%22withArticleRichContentState%22%3Atrue%2C%22withArticlePlainText%22%3Afalse%2C%22withGrokAnalyze%22%3Afalse%7D`,
    {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        authorization:
          "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "content-type": "application/json",
        priority: "u=1, i",
        "sec-ch-ua":
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-client-transaction-id":
          "Wrdg0MrefzpjAczgX2jye33wFrdElzhi3P9+VHaFYP9UPGEAom97LFYpk7zd3wc118OvbFgMtLEjZb7qUJRMEiqpHn91WQ",
        "x-guest-token": guestToken,
        "x-twitter-active-user": "yes",
        "x-twitter-client-language": "en",
      },
      agent: agent,
      referrer: "https://x.com/",
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
    }
  );
  const responseJson = await response.json();
  res.status(200).send(responseJson);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.includes("x.com") || message.content.includes("twitter.com")) {
    console.log("A tweet has been sent !");
    const tweetURL = message.content.split(' ').find(url => url.includes('x.com') || url.includes('twitter.com'));
    if (!tweetURL) return;

    const tweetID = tweetURL.split('/').pop().split('?')[0];
    try {
      const response = await fetch(`http://localhost:${port}/${tweetID}`);
      const tweetData = await response.json();
      const mediaUrls = [];
      const mediaEntities =
        tweetData.data.tweetResult.result.legacy.extended_entities?.media || [];

      for (const media of mediaEntities) {
        if (media.type === "photo") {
          mediaUrls.push(media.media_url_https);
        } else if (media.type === "video" || media.type === "animated_gif") {
          const variants = media.video_info.variants;
          const highestBitrateVariant = variants.reduce((prev, current) => {
            return prev.bitrate > current.bitrate ? prev : current;
          });
          mediaUrls.push(highestBitrateVariant.url.slice(0, -7));
        }
      }

      const quotedStatus = tweetData.data.tweetResult.result.quoted_status_result;
      if (quotedStatus) {
        const quotedTweetText = quotedStatus.result.legacy.full_text;
        if (quotedTweetText) {
          const textWithoutLink = quotedTweetText.split("http")[0].trim();
          await message.channel.send("Quoted tweet text : " +'"' + textWithoutLink + '"');
        }
        const quotedMediaEntities =
          quotedStatus.result.legacy.extended_entities?.media || [];
        for (const media of quotedMediaEntities) {
          if (media.type === "photo") {
            mediaUrls.push(media.media_url_https);
          } else if (media.type === "video" || media.type === "animated_gif") {
            const variants = media.video_info.variants;
            const highestBitrateVariant = variants.reduce((prev, current) => {
              return prev.bitrate > current.bitrate ? prev : current;
            });
            mediaUrls.push(highestBitrateVariant.url.slice(0, -7));
          }
        }
      }

      if (mediaUrls.length > 0) {
        const uploadFiles = [];
        for (const mediaUrl of mediaUrls) {
          const fileResponse = await fetch(mediaUrl);
          if (fileResponse.ok) {
            const arrayBuffer = await fileResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const filename = mediaUrl.split('/').pop();
            const tempFile = tmp.fileSync();
            fs.writeFileSync(tempFile.name, buffer);
            uploadFiles.push(new AttachmentBuilder(tempFile.name, { name: filename }));
          } else {
            console.error(`Error downloading the media: ${mediaUrl}`);
          }
        }

        if (uploadFiles.length > 0) {
          await message.channel.send({ content: "Tweet media(s) :", files: uploadFiles });
        }
      }
    } catch (error) {
      console.error(error);
      await message.channel.send(`Error extracting media.`);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);