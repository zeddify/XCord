const fs = require("fs");
const tmp = require("tmp");
const { AttachmentBuilder } = require("discord.js");

const MAX_UPLOAD_SIZE = 25 * 1024 * 1024; // 25 MB

async function downloadMedia(mediaUrls) {
  const uploadFiles = [];
  const oversizedMediaUrls = [];

  for (const mediaUrl of mediaUrls) {
    const fileResponse = await fetch(mediaUrl);
    if (fileResponse.ok) {
      const arrayBuffer = await fileResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length > MAX_UPLOAD_SIZE) {
        oversizedMediaUrls.push(mediaUrl);
        continue;
      }

      const filename = mediaUrl.split('/').pop();
      const tempFile = tmp.fileSync();
      fs.writeFileSync(tempFile.name, buffer);
      uploadFiles.push(new AttachmentBuilder(tempFile.name, { name: filename }));
    } else {
      console.error(`Error downloading the media: ${mediaUrl}`);
    }
  }
  return { uploadFiles, oversizedMediaUrls };
}

module.exports = { downloadMedia };