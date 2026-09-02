require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");

// ==========================================
// ANTI-CRASH SYSTEM
// ==========================================
process.on('unhandledRejection', (reason) => console.log('[Anti-Crash] Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.log('[Anti-Crash] Uncaught Exception:', err));
process.on('uncaughtExceptionMonitor', (err) => console.log('[Anti-Crash] Uncaught Exception (Monitor):', err));

// Helper function to pause execution cleanly
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const client = new Client({
    checkUpdate: false,
    // Spoofing the connection to look like a standard Windows desktop app
    ws: {
        properties: {
            $os: "Windows",
            $browser: "Discord Client",
            $device: "desktop"
        }
    }
});

let isPaused = false; 

const POKETWO_BOT_ID = "716390085896962058"; 

// Array containing all four helper bots
const HELPER_BOT_IDS = [
    "1307910235737948252", // hatenna
    "1411516692781072434", // cz inf
    "854233015475109888" // <-- p2a
];

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag} - Stealth Mode Active (Fast)`);
});

client.on("messageCreate", async (message) => {
    const msgContent = message.content.trim().toLowerCase();

    // 1. Handle Pause/Resume Commands
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
        return; 
    }

    if (isPaused) return;

    // 2. Captcha Detection
    if (
        message.author.id === POKETWO_BOT_ID && 
        message.content.includes("Please tell us you're human!") && 
        message.content.includes(client.user.id)
    ) {
        isPaused = true; 
        console.log("⚠️ Captcha detected targeting YOUR account. Script paused.");
        return; 
    }

    // 3. Shiny Catch Detection
    if (
        message.author.id === POKETWO_BOT_ID && 
        message.content.includes("These colors seem unusual...") && 
        message.content.includes(client.user.id)
    ) {
        isPaused = true; 
        console.log("✨ Shiny caught - script paused.");
        return; 
    }

    // 4. Collection Ping / Catch Detection
    if (HELPER_BOT_IDS.includes(message.author.id) && message.content.includes(client.user.id)) {
        
        const firstLine = message.content.split('\n')[0];
        const nameMatch = firstLine.split(/<|:/)[0];
        
        if (nameMatch) {
            let pokemonName = nameMatch.trim();
            
            // If the name has more than one word, look for "Best name" or "Shortest Name"
            if (pokemonName.includes(" ")) {
                const bestNameMatch = message.content.match(/Best name:\s*([^\n]+)/i);
                const shortestNameMatch = message.content.match(/Shortest Name:\s*([^\n]+)/i);
                
                if (bestNameMatch) {
                    pokemonName = bestNameMatch[1].trim();
                } else if (shortestNameMatch) {
                    pokemonName = shortestNameMatch[1].trim();
                }
            }

            if (pokemonName) {
                console.log(`\n🔔 Pinged for: ${pokemonName}`);

                // --- ADJUSTED FAST HUMANIZATION LOGIC ---

                // 1. Reaction / Read Delay (Max reduced by 200ms)
                // Base reaction: 300ms to 600ms
                let readDelay = 300 + Math.floor(Math.random() * 300);

                // 10% chance to be "distracted"
                const isDistracted = Math.random() < 0.10;
                if (isDistracted) {
                    const distractionTime = 2000 + Math.floor(Math.random() * 3000); // 2 to 5 seconds
                    readDelay += distractionTime;
                    console.log(`[Stealth] Distraction triggered. Delaying reaction by ${distractionTime}ms`);
                }

                await sleep(readDelay);

                // 2. Start Typing Indicator
                await message.channel.sendTyping().catch(() => {});

                // 3. Typing Speed Delay (Fast typing)
                // Simulating roughly 40ms to 80ms per character
                const msPerChar = 40 + Math.floor(Math.random() * 40);
                const typingDelay = pokemonName.length * msPerChar;
                
                await sleep(typingDelay);

                // 4. Command Obfuscation / Randomization
                const commandVariants = ["c", "catch"];
                const cmd = commandVariants[Math.floor(Math.random() * commandVariants.length)];

                // Ensure name goes lowercase most of the time for natural typing
                if (Math.random() < 0.70) {
                    pokemonName = pokemonName.toLowerCase();
                }

                const extraSpace = Math.random() < 0.3 ? "  " : " ";
                const finalMessage = `<@${POKETWO_BOT_ID}>${extraSpace}${cmd} ${pokemonName}`;

                // Send the final message
                message.channel.send(finalMessage).catch(() => {});
                console.log(`🏓 Caught: ${pokemonName} (Read: ${readDelay}ms | Typed: ${typingDelay}ms)`);
            }
        }
    }
});

client.login(process.env.TOKEN);
