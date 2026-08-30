require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Servers: ${client.guilds.cache.size}`);
});

client.on("messageCreate", (message) => {
    console.log(
        `[${message.guild?.name ?? "DM"}] ${message.author.tag}: ${message.content}`
    );
});

client.login(process.env.TOKEN);
