require("dotenv").config();
const { Client, Events } = require("@altkit/discord");

// ==========================================
// ANTI-CRASH SYSTEM
// ==========================================
process.on('unhandledRejection', (reason) => console.log('[Anti-Crash] Unhandled Rejection:', reason));
process.on('uncaughtException', (err) => console.log('[Anti-Crash] Uncaught Exception:', err));
process.on('uncaughtExceptionMonitor', (err) => console.log('[Anti-Crash] Uncaught Exception (Monitor):', err));

// Helper function to pause execution cleanly
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// AltKit automatically handles modern connection spoofing out of the box
const client = new Client();

let isPaused = false; 
let isAFK = false; // Tracks if the bot is taking a random break

const POKETWO_BOT_ID = "716390085896962058"; 
const HELPER_BOT_IDS = [
    "1307910235737948252", 
    "1411516692781072434", 
    "1254602968938844171",
    "854233015475109888" 
];

// Helper function to simulate a random typing typo
function simulateTypo(word) {
    if (word.length < 4) return word; 
    const arr = word.split('');
    // Swap two random adjacent letters
    const idx = 1 + Math.floor(Math.random() * (arr.length - 3)); 
    const temp = arr[idx];
    arr[idx] = arr[idx + 1];
    arr[idx + 1] = temp;
    return arr.join('');
}

// v14 Syntax: Use Events.ClientReady
client.once(Events.ClientReady, (readyClient) => {
    console.log(`Logged in as ${readyClient.user.tag} - Ultimate Stealth Mode (AltKit) Active`);
});

// v14 Syntax: Use Events.MessageCreate
client.on(Events.MessageCreate, async (message) => {
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

    if (isPaused || isAFK) return;

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
        
        // --- STEALTH FEATURE: 5% Chance to miss the ping entirely ---
        if (Math.random() < 0.05) {
            console.log("🙈 [Stealth] Simulated human error: Ignored this ping.");
            return; 
        }

        // --- STEALTH FEATURE: 2% Chance to go AFK for 10-20 minutes ---
        if (Math.random() < 0.02) {
            const afkTime = 600000 + Math.floor(Math.random() * 600000); // 10 to 20 mins
            isAFK = true;
            console.log(`🚶 [Stealth] Taking a bathroom break. AFK for ${Math.floor(afkTime / 60000)} minutes.`);
            
            setTimeout(() => {
                isAFK = false;
                console.log("🔙 [Stealth] Back at the keyboard.");
            }, afkTime);
            
            return; 
        }

        const firstLine = message.content.split('\n')[0];
        const nameMatch = firstLine.split(/<|:/)[0];
        
        if (nameMatch) {
            let pokemonName = nameMatch.trim();
            
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

                // Reaction / Read Delay 
                let readDelay = 300 + Math.floor(Math.random() * 300);

                // 10% chance to be "distracted" for a few seconds
                if (Math.random() < 0.10) {
                    const distractionTime = 2000 + Math.floor(Math.random() * 3000); 
                    readDelay += distractionTime;
                    console.log(`[Stealth] Distraction triggered. Delaying reaction by ${distractionTime}ms`);
                }

                await sleep(readDelay);
                await message.channel.sendTyping().catch(() => {});

                // Typing Speed Delay 
                const msPerChar = 40 + Math.floor(Math.random() * 40);
                const typingDelay = pokemonName.length * msPerChar;
                await sleep(typingDelay);

                // --- STEALTH FEATURE: 5% chance to make a typo ---
                if (Math.random() < 0.05) {
                    pokemonName = simulateTypo(pokemonName);
                    console.log(`[Stealth] Made a typo: ${pokemonName}`);
                }

                const commandVariants = ["c", "catch"];
                const cmd = commandVariants[Math.floor(Math.random() * commandVariants.length)];

                if (Math.random() < 0.70) {
                    pokemonName = pokemonName.toLowerCase();
                }

                // --- STEALTH FEATURE: 3% chance to forget the space (e.g. "cpikachu") ---
                const extraSpace = Math.random() < 0.03 ? "" : (Math.random() < 0.3 ? "  " : " ");
                
                const finalMessage = `<@${POKETWO_BOT_ID}>${extraSpace}${cmd} ${pokemonName}`;

                message.channel.send(finalMessage).catch(() => {});
                console.log(`🏓 Caught: ${pokemonName} (Read: ${readDelay}ms | Typed: ${typingDelay}ms)`);
            }
        }
    }
});

client.login(process.env.TOKEN);
