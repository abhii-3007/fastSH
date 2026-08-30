require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

const client = new Client({
    checkUpdate: false
});

let myId = "";
let isPaused = false; // Tracks whether the bot should respond

client.once("ready", () => {
    myId = `<@${client.user.id}>`;
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
    // 1. If the script is paused, ignore everything immediately
    if (isPaused) return;

    // 2. Prevent infinite loops
    if (message.author.id === client.user.id) return;

    // 3. Captcha Detection
    // Check if the sender is the specific bot ID AND the message contains the captcha text
    if (
        message.author.id === "716390085896962058" && 
        message.content.includes("Please tell us you're human!")
    ) {
        isPaused = true; // Pause the script globally
        console.log("captcha detected paused");
        return; // Stop processing this specific message
    }

    // 4. Ping Detection (only runs if NOT paused and NOT a captcha)
    if (message.content.includes(myId)) {
        message.channel.send("<@716390085896962058> c eiscue");
    }
});

client.login(process.env.TOKEN);

