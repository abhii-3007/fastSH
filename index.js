require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

// ==========================================
// ANTI-CRASH SYSTEM
// Prevents the bot from shutting down due to unhandled errors
// ==========================================
process.on('unhandledRejection', (reason, promise) => {
    console.log('[Anti-Crash] Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err, origin) => {
    console.log('[Anti-Crash] Uncaught Exception:', err);
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('[Anti-Crash] Uncaught Exception (Monitor):', err);
});
// ==========================================

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

client.on("messageCreate", async (message) => {
    // Make the command lowercase and remove extra spaces to prevent typos from breaking it
    const msgContent = message.content.trim().toLowerCase();

    // 1. Handle commands sent by YOU (must be from the account the token belongs to)
    if (message.author.id === client.user.id) {
        if (msgContent === "!pause") {
            isPaused = true;
            console.log("⏸️ Bot manually paused.");
            return;
        }
        if (msgContent === "!resume") {
            isPaused = false;
            console.log("▶️ Bot manually resumed.");
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
        console.log("⚠️ Captcha detected, script paused.");
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
            
            // ANTI-DETECTION: Add a realistic human reaction time (300ms to 600ms)
            const reactionTime = 300 + Math.floor(Math.random() * 300);
            
            // ANTI-DETECTION: 1-second base delay + up to 800ms random typing speed variance
            const typeDelay = 1000 + Math.floor(Math.random() * 800);

            setTimeout(async () => {
                // Simulate the "User is typing..." status indicator in Discord
                await message.channel.sendTyping().catch(() => {});

                setTimeout(() => {
                    // Send the catch message to the channel pinging the Poketwo bot
                    message.channel.send(`<@${POKETWO_BOT_ID}> c ${pokemonName}`).catch(() => {});
                    console.log(`🏓 Caught: ${pokemonName} (Typing delayed for ${typeDelay}ms)`);
                }, typeDelay);

            }, reactionTime);
        }
    }
});

client.login(process.env.TOKEN);
