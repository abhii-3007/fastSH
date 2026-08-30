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
    // 1. Safety check to prevent infinite loops if your own message contains a ping
    if (message.author.id === client.user.id) return;

    // 2. Trigger only if your account is mentioned in the message
    if (message.mentions.has(client.user)) {
        
        // 3. Send the specific text directly to the channel where the ping occurred
        message.channel.send("<@716390085896962058> c eiscue");
        
        console.log(`Triggered specific response in: ${message.guild?.name ?? "DM"} -> #${message.channel.name}`);
    }
});


client.login(process.env.TOKEN);
