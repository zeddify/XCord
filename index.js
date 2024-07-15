const {
  Client,
  GatewayIntentBits,
  ActivityType,
  Events,
  EmbedBuilder,
} = require("discord.js");
const express = require("express");
require("dotenv").config();
const tweetRoute = require("./router.js");
const handleMessage = require("./events/messageEvent");
const helpCommand = require("./commands/help");
const pingCommand = require("./commands/ping")

// Discord bot intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const app = express();
const port = 3000;

app.use("/", tweetRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [
      {
        name: `/help • ${client.guilds.cache.size} servers`,
        type: ActivityType.Watching,
      },
    ],
  });
  await client.application.commands.create({
    name: "help",
    description: '❓ | Useful info & links',
  });
});

await client.application.commands.create({
  name: "ping",
  description: '💓 | Check how XCord is doing!',
});

// when joining a new discord
client.on(Events.GuildCreate, async (guild) => {
  const channel =
    guild.systemChannel ||
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
  	.addFields(
    	{name :'Note', value :"Consider using **/help** if I don't react to your messages."})
    .setColor("#000000")
    .setTimestamp();
  await owner.send({ embeds: [embed] });
  console.log(`Message sent to owner ${owner.user.tag} of server ${guild.name}`);
});

// refresh activity status every minute
setInterval(() => {
  client.user.setPresence({
    activities: [
      {
        name: `${client.guilds.cache.size} servers`,
        type: ActivityType.Watching,
      },
    ],
  });
}, 60000);

// react to /help and /ping commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "help") {
    helpCommand.execute(interaction);
  } else if (interaction.commandName === "ping") {
    pingCommand.execute(interaction);
  }
});

// react to twitter urls
client.on("messageCreate", handleMessage);

client.login(process.env.DISCORD_TOKEN);
