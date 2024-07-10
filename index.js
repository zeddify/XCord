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
        name: `${client.guilds.cache.size} servers`,
        type: ActivityType.Watching,
      },
    ],
  });
  await client.application.commands.create({
    name: "help",
    description: '❓| Useful info & links',
  });
});

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
    .setDescription(
      `Thanks for inviting me to your server **${guild.name}**! Consider using **/help** first and foremost.`
    )
    .setColor("#000000")
    .setTimestamp();
  await owner.send({ embeds: [embed] });
  console.log(`Embed sent to owner ${owner.user.tag} of server ${guild.name}`);
});

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "help") {
    helpCommand.execute(interaction);
  }
});

client.on("messageCreate", handleMessage);

client.login(process.env.DISCORD_TOKEN);
