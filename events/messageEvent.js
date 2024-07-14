const { downloadMedia } = require("../utils/downloadMediaUtil.js");
const { convertMp4ToGif } = require("../utils/convertMp4ToGifUtil.js");
const { PermissionsBitField } = require('discord.js');

const MAX_BITRATE = 2176000;  // bits per second

async function handleMessage(message) {
  if (message.author.bot) return;

  if (!message.channel.permissionsFor(message.client.user).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory])) {
    console.error('Missing SEND_MESSAGES or READ_MESSAGE_HISTORY permission in this channel.');
    return;
  }

  if (message.content.includes("x.com") || message.content.includes("twitter.com")) {
    console.log("A link has been sent !");
    const tweetURL = message.content.split(' ').find(url => (url.includes('x.com') && url.includes('/status/')) || (url.includes('twitter.com') && url.includes('/status/')));
    if (!tweetURL) {
      console.log("No post found for this link.");
      return;
    }
    console.log(`Tweet URL : ${tweetURL}`);

    const tweetID = tweetURL.split('/').pop().split('?')[0];
    try {
      const response = await fetch(`http://localhost:3000/${tweetID}`);
      const tweetData = await response.json();
      const mediaUrls = [];
      const gifUrls = [];
      const mediaEntities = tweetData.data.tweetResult.result.legacy.extended_entities?.media || [];

      for (const media of mediaEntities) {
        if (media.type === "photo") {
          mediaUrls.push(media.media_url_https);
        } else if (media.type === "video" || media.type === "animated_gif") {
          const variants = media.video_info.variants;
          const suitableVariants = variants.filter(variant => variant.bitrate <= MAX_BITRATE);
          if (suitableVariants.length > 0) {
            const highestBitrateVariant = suitableVariants.reduce((prev, current) => {
              return prev.bitrate > current.bitrate ? prev : current;
            });
            const mediaUrl = highestBitrateVariant.url;
            if (media.type === "animated_gif") {
              gifUrls.push(mediaUrl);  
            } else if (mediaUrl.endsWith(".mp4")) {
              mediaUrls.push(mediaUrl);
            } else {
              mediaUrls.push(mediaUrl.slice(0, -7));  
            }
          } else {
            console.log("No suitable video variant found within the bitrate limit.");
          }
        }
      }

      const quotedStatus = tweetData.data.tweetResult.result.quoted_status_result;
      if (quotedStatus) {
        const quotedTweetText = quotedStatus.result.legacy.full_text;
        if (quotedTweetText) {
          const textWithoutLink = quotedTweetText.split("http")[0].trim();
          await message.channel.send("**Quoted tweet text : **" + '"' + textWithoutLink + '"');
        }
        const quotedMediaEntities = quotedStatus.result.legacy.extended_entities?.media || [];
        for (const media of quotedMediaEntities) {
          if (media.type === "photo") {
            mediaUrls.push(media.media_url_https);
          } else if (media.type === "video" || media.type === "animated_gif") {
            const variants = media.video_info.variants;
            const suitableVariants = variants.filter(variant => variant.bitrate <= MAX_BITRATE);
            if (suitableVariants.length > 0) {
              const highestBitrateVariant = suitableVariants.reduce((prev, current) => {
                return prev.bitrate > current.bitrate ? prev : current;
              });
              const mediaUrl = highestBitrateVariant.url;
              if (media.type === "animated_gif") {
                gifUrls.push(mediaUrl);  
              } else if (mediaUrl.endsWith(".mp4")) {
                mediaUrls.push(mediaUrl);
              } else {
                mediaUrls.push(mediaUrl.slice(0, -7));  
              }
            } else {
              console.log("No suitable quoted video variant found within the bitrate limit.");
            }
          }
        }
      }

      const allUploadFiles = [];

      if (mediaUrls.length > 0) {
        const uploadFiles = await downloadMedia(mediaUrls);
        if (uploadFiles.length > 0) {
          allUploadFiles.push(...uploadFiles);
        }
      }

      if (gifUrls.length > 0) {
        const gifFiles = await convertMp4ToGif(gifUrls);
        if (gifFiles.length > 0) {
          allUploadFiles.push(...gifFiles);
        }
      }

      if (allUploadFiles.length > 0) {
        await message.channel.send({ content: "**Tweet media(s) :**", files: allUploadFiles });
      }

    } catch (error) {
      console.error(error);
      await message.channel.send(`Error extracting media. Might happen when Discord can't preview your tweet, or file may be too large to upload.`);
    }
  }
}

module.exports = handleMessage;