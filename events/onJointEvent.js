const { EmbedBuilder } = require('discord.js');
const helpCommand = require('../commands/help');

async function handleOnJoin(guild) {
  const channel = guild.systemChannel ||
    guild.channels.cache.find((channel) => channel.type === "GUILD_TEXT");
  
  if (channel) {
    const fakeInteraction = {
      commandName: "help",
      reply: async (message) => {
        await channel.send(message);
      },
    };
    helpCommand.execute(fakeInteraction);
  }

  const owner = await guild.fetchOwner();
  const embed = new EmbedBuilder()
    .setTitle(`Hello ${owner.user.username}!`)
    .setDescription(`Thanks for inviting me to your server **${guild.name}**!`)
    .addFields({ name: 'Note', value: "Consider using **/help** if I don't react to your messages." })
    .setColor("#000000")
    .setTimestamp();

  try {
    await owner.send({ embeds: [embed] });
    console.log(`Message sent to owner ${owner.user.tag} of server ${guild.name}`);
  } catch (error) {
    if (error.code === 50007) {
      console.log(`Cannot send message to user ${owner.user.tag}. They might have DMs disabled.`);
    } else {
      console.error(`Failed to send message to owner ${owner.user.tag}:`, error);
    }
  }
}

module.exports = handleOnJoin;