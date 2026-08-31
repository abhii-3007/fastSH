require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
    checkUpdate: false
});

let myId = "";
let isPaused = false; // Tracks whether the bot should respond

const POKETWO_BOT_ID = "716390085896962058"; // The main bot (for captchas and catching)
const HELPER_BOT_ID = "1307910235737948252"; // The bot that pings you with the stats

client.once("ready", () => {
    myId = `<@${client.user.id}>`;
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    // 1. Handle commands sent by YOU
    if (message.author.id === client.user.id) {
        if (message.content === "!pause") {
            isPaused = true;
            console.log("Bot manually paused.");
            return;
        }
        if (message.content === "!resume") {
            isPaused = false;
            console.log("Bot manually resumed.");
            return;
        }
        // Prevent infinite loops for any other messages sent by you
        return; 
    }

    // 2. If the script is paused, ignore everything else
    if (isPaused) return;

    // 3. Captcha Detection (Listens to the main bot)
    if (
        message.author.id === POKETWO_BOT_ID && 
        message.content.includes("Please tell us you're human!")
    ) {
        isPaused = true; 
        console.log("Captcha detected, script paused.");
        return; 
    }

    // 4. Collection Ping / Catch Detection (Listens to the helper bot)
    if (message.author.id === HELPER_BOT_ID && message.content.includes(myId)) {
        // Read the very first line of the message (e.g., "Klawf <:rock:123...>: 99.83%")
        const firstLine = message.content.split('\n')[0];
        
        // Split at the "<" character to isolate just the Pokémon's name from the emoji
        const nameMatch = firstLine.split('<')[0];
        
        if (nameMatch) {
            // Remove extra spaces and make it lowercase
            const pokemonName = nameMatch.trim().toLowerCase();
            
            // Send the catch message to the channel pinging the Poketwo bot
            message.channel.send(`<@${POKETWO_BOT_ID}> c ${pokemonName}`);
            console.log(`Ping detected! Attempted to catch: ${pokemonName}`);
        }
    }
});

client.login(process.env.TOKEN);
