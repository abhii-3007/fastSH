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
const HELPER_BOT_IDS = [
    "1307910235737948252", 
    "1411516692781072434", 
    "1254602968938844171"
];

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag} - Stealth Mode Active`);
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
    if (message.author.id === POKETWO_BOT_ID && message.content.includes("Please tell us you're human!")) {
        isPaused = true; 
        console.log("⚠️ Captcha detected, script paused.");
        return; 
    }

    // 3. Collection Ping / Catch Detection
    if (HELPER_BOT_IDS.includes(message.author.id) && message.content.includes(client.user.id)) {
        
        const firstLine = message.content.split('\n')[0];
        const nameMatch = firstLine.split(/<|:/)[0];
        
        if (nameMatch) {
            let pokemonName = nameMatch.trim();
            
            if (pokemonName) {
                console.log(`\n🔔 Pinged for: ${pokemonName}`);

                // --- ADVANCED HUMANIZATION LOGIC ---

                // 1. Reaction / Read Delay (Time it takes a human to notice the ping)
                // Base reaction: 800ms to 2000ms
                let readDelay = 800 + Math.floor(Math.random() * 1200);

                // 10% chance to be "distracted" and take way longer to reply (4 to 10 extra seconds)
                const isDistracted = Math.random() < 0.10;
                if (isDistracted) {
                    const distractionTime = 4000 + Math.floor(Math.random() * 6000);
                    readDelay += distractionTime;
                    console.log(`[Stealth] Distraction triggered. Delaying reaction by ${distractionTime}ms`);
                }

                await sleep(readDelay);

                // 2. Start Typing Indicator
                await message.channel.sendTyping().catch(() => {});

                // 3. Typing Speed Delay (Based on word length)
                // Humans type around 80ms to 150ms per character
                const msPerChar = 80 + Math.floor(Math.random() * 70);
                const typingDelay = pokemonName.length * msPerChar;
                
                await sleep(typingDelay);

                // 4. Command Obfuscation / Randomization
                // Randomly choose between "c" and "catch"
                const commandVariants = ["c", "catch"];
                const cmd = commandVariants[Math.floor(Math.random() * commandVariants.length)];

                // Randomly decide whether to convert the pokemon name to fully lowercase (humans are lazy)
                // 70% chance to lowercase it, 30% chance to leave it capitalized as it was in the ping
                if (Math.random() < 0.70) {
                    pokemonName = pokemonName.toLowerCase();
                }

                // Occasionally add a random extra space between the bot ping and the command
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
