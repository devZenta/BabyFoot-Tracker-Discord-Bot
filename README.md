# BabyFoot Discord Bot

![BabyFoot Tracker](https://cdn.discordapp.com/attachments/1320854475279433872/1320854565800775790/logo.png?ex=6775006c&is=6773aeec&hm=8f27aa7dffbb8935adfbee7f4d59f4bcf3ef27f8dc00b574d3ff10e2e61761ea&)

BabyFoot Tracker is a Discord bot designed to manage and track games of table football. It provides various commands for users and admins to interact with the bot and manage player statistics.

## Features

- Create and manage player accounts
- Track player statistics including ELO, wins, losses, goals scored, and goals conceded
- Admin commands to update player statistics
- Real-time status updates

## Commands

### User Commands

- `/create-account`: Create an account
- `/stats [player]`: View the statistics of a player

### Admin Commands

- `/admin goals-scored id value`: Update the goals scored by the player
- `/admin goals-conceded id value`: Update the goals conceded by the player
- `/admin username id value`: Update the username of the player
- `/admin elo id value`: Update the ELO of the player
- `/admin win id value`: Update the win count of the player
- `/admin loose id value`: Update the loss count of the player
- `/admin game id value`: Update the game count of the player
- `/delete-bdd table`: Delete all data from the specified table (Player or GameHistory)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/devZenta/BabyFoot-Project.git
    cd babyfoot-discord-bot
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/0) file and add your Discord bot token and other necessary environment variables:
    ```env
    TOKEN=your-discord-bot-token
    CLIENT_ID=your-client-id
    ADMIN_USER_ID=your-admin-user-id
    PRIVATE_GUILD_ID=your-private-guild-id
    PRIVATE_CHANNEL_ID=your-private-channel-id
    LOGO_URL=your-logo-url
    GITHUB_URL=your-github-url
    ```

4. Deploy the commands:
    ```sh
    node deploy-commands.js
    ```

5. Start the bot:
    ```sh
    node index.js
    ```

## Usage

Once the bot is running, you can interact with it using the commands listed above. Make sure to invite the bot to your server with the necessary permissions.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the ISC License.

## Acknowledgements

- Created by [zenta](https://github.com/devZenta)
- Powered by [Discord.js](https://discord.js.org/)
- Database management with [Sequelize](https://sequelize.org/)
