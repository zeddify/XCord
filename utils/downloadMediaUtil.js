const fs = require("fs");
const tmp = require("tmp");
const { AttachmentBuilder } = require("discord.js");

async function downloadMedia(mediaUrls) {
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
  return uploadFiles;
}

module.exports = { downloadMedia };