require("dotenv").config();

// 1. Import Client directly from the selfbot library
const { Client } = require("discord.js-selfbot-v13");

// 2. Initialize without GatewayIntentBits
const client = new Client({
    checkUpdate: false // Optional: hides library update warnings in your console
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
