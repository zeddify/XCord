module.exports = {
    execute(interaction) {
      const helpMessage = `
        # How to use

Simply paste a Twitter URL in any channel, and it will fetch and display the tweet information and media.
      `;
      interaction.reply(helpMessage);
    }
  };
  