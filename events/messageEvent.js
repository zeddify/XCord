const { downloadMedia } = require("../utils/downloadMediaUtil.js");
const { PermissionsBitField } = require('discord.js');

async function handleMessage(message) {
  if (message.author.bot) return;

  if (!message.channel.permissionsFor(message.client.user).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory])) {
    console.error('Missing SEND_MESSAGES or READ_MESSAGE_HISTORY permission in this channel.');
    return;
  }

  if (message.content.includes("x.com") || message.content.includes("twitter.com")) {
    console.log("A tweet has been sent !");
    const tweetURL = message.content.split(' ').find(url => url.includes('x.com') || url.includes('twitter.com'));
    if (!tweetURL) return;

    const tweetID = tweetURL.split('/').pop().split('?')[0];
    try {
      const response = await fetch(`http://localhost:3000/${tweetID}`);
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
          await message.channel.send("**Quoted tweet text : **" + '"' + textWithoutLink + '"');
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
        const uploadFiles = await downloadMedia(mediaUrls);
        if (uploadFiles.length > 0) {
          await message.channel.send({ content: "**Tweet media(s) :**", files: uploadFiles });
        }
      }
    } catch (error) {
      console.error(error);
      await message.channel.send(`Error extracting media.`);
    }
  }
}

module.exports = handleMessage;