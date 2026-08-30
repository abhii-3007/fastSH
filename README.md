# Pokémon Helper — Discord Bot Starter

A clean Node.js Discord bot starter for learning Discord Gateway events,
message handling, parsing, and latency measurement.

## Requirements

- Node.js 18+
- A Discord bot application/token
- Message Content Intent enabled if you need to read message text

## Setup

```bash
npm install
cp .env.example .env
```

Put your bot token in `.env`:

```env
TOKEN=your_bot_token_here
```

Start:

```bash
npm start
```

## Project structure

```text
pokemon-helper/
├── index.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

`.env` is intentionally ignored by Git so the token is not committed.

## Next learning stages

1. Filter messages by helper-bot ID.
2. Detect a particular user mention.
3. Parse the Pokémon name from the first line.
4. Measure event-processing latency.
5. Add duplicate-event protection and error handling.

This project uses a normal Discord bot account, not a user-account selfbot.
