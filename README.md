# XCord

XCord is a Discord bot that interacts with Twitter. It fetches tweet information and media, and shares them in your Discord server. This bot uses proxies to avoid IP bans and fetches a new guest token periodically to ensure continued access to the Twitter API.

## Features

- Fetches and displays tweet information from a given Twitter URL.
- Downloads and shares tweet media (photos, videos, GIFs) in the Discord channel.
- Automatically handles quoted tweets and shares their media as well.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your computer.
- A Discord bot token. You can get one by creating a bot on the [Discord Developer Portal](https://discord.com/developers/applications).
- PowerShell 3.0 or higher installed on your system (for Windows users).

## Installation and usage

1. Clone the repository : 
    
    	git clone https://github.com/your-username/xcord.git
    	cd xcord

2. Install the dependencies : 
    	
        npm install

3. Create a .env file in the root directory which contains your Discord bot token :

        DISCORD_TOKEN=[your_discord_token]

4. Start the express server :

        node index.js

5. Invite the bot to your Discord server then send a Twitter URL in any channel and it will fetch and display the tweet medias.