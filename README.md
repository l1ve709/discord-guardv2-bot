# GuardXnsole - Professional Discord Protection Bot

GuardXnsole is a high-performance, advanced security bot designed to protect your server from all types of attacks and malicious activities. With its SQLite-based database and real-time audit log scanning, it keeps your server safe 24/7.

## Features

We offer a comprehensive range of protection for your server's security:

*   **🛡️ Core Protections**: Protects Channels, Roles, Bans, Kicks, and Server settings.
*   **🤖 Bot Protection**: Prevents unauthorized bots from joining your server.
*   **🔗 Webhook Protection**: Blocks attacks via Webhook and prevents unauthorized webhook creation.
*   **😀 Emoji & Sticker Protection**: Prevents deletion or modification of emojis and stickers.
*   **🚫 Spam & Ad Protection**: Automatically blocks and penalizes rapid messaging and invite links.
*   **⚔️ Raid Protection**: Instantly detects and blocks mass join attacks (raider accounts).
*   **🔞 NSFW Protection**: Scans and cleans obscene content in message attachments using AI (NSFWJS).
*   **💎 Vanity URL Protection**: Protects your server's custom invite link.

## ⚙️ Advanced Limit System

Set customizable limits for each action type:
- Maximum number of actions allowed within a specific time frame.
- Special limit multipliers for users with Administrator permissions.
- Automatic penalties upon limit exceedance (Ban, Kick, or Role Removal).

## Logging

Track everything happening on your server with an advanced log system:
- **Mod Log**: Track moderator actions.
- **Message Log**: Catch deleted and edited messages.
- **Voice Log**: Follow move/join/leave actions in voice channels.

## 🛠️ Installation

1.  Download the project files.
2.  Install required libraries with the `npm install` command.
3.  Create a `.env` file and fill in `BOT_TOKENI`, `ISTEMCI_ID`, and `SAHIP_ID`.
4.  Run the bot with the `node main.js` (or `npm run baslat`) command.

## 📜 Commands

The bot is managed entirely through Slash Commands (`/`).
- `/kurulum`: Performs basic bot setup.
- `/ayar`: Updates protection settings and limits.
- `/whitelist`: Excludes specific users or roles from protection.
- `/logs`: Displays recent block logs.

---
**Developer:** guardxnsole - instagram.com/ediz.dll discord: cxnsole
