const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const express = require("express");
require("dotenv").config();
const tweetRoute = require("./router.js");
const handleMessage = require("./events/messageEvent");
const helpCommand = require("./commands/help");


// Discord bot intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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
  activities: [{ name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }]
});
  await client.application.commands.create({
    name: 'help',
    description: 'Display basic help',
  });
});

  setInterval(() => {
    client.user.setPresence({
  	activities: [{ name: `${client.guilds.cache.size} servers`, type: ActivityType.Watching }]
	});
  }, 60000); 

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'help') {
    helpCommand.execute(interaction);
  }
});

client.on("messageCreate", handleMessage);

client.login(process.env.DISCORD_TOKEN);