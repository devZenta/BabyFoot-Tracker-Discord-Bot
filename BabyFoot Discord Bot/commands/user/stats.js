const { SlashCommandBuilder, codeBlock, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Player = require('../../models/player');

require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Stats command')
        .addUserOption(option =>
			option
				.setName('player')
				.setDescription('The player you want to see the stats of.')),    
	async execute(interaction) {

        let playerStats;
        const playerInput = interaction.options.getUser('player');
		const user = interaction.user;
        const userId = interaction.user.id;

        if (playerInput === null) {
            playerStats = userId;
        } else {
            playerStats = playerInput.id;
        }

        try {
            
            const player = await Player.findOne({ where: { id: playerStats } });
            
            const loadingMessage = codeBlock(`🔄 loading...`);

            await interaction.reply({ 
                content: `${loadingMessage}`, 
                fetchReply: true, 
                ephemeral: true 
            });

            if (player) {
                
                const usernamePlayer = player.get('username');
                const eloPlayer = player.get('elo');
                const winPlayer = player.get('wins');
                const loosePlayer = player.get('losses');
                const gamesPlayed = player.get('games');
                const winratePlayer = player.winrate;
                const goalsScored = player.get('goalsScored');
                const goalsConceded = player.get('goalsConceded');
                const goalRatio = player.goalRatio;

                const codeBlockStatsMessage = codeBlock(`Username: ${usernamePlayer}\nElo: ${eloPlayer}\nWin Rate: ${winratePlayer}%\nWins: ${winPlayer}\nLosses: ${loosePlayer}\nGames played: ${gamesPlayed}\nGoal Ratio: ${goalRatio}\nGoals scored: ${goalsScored}\nGoals conceded: ${goalsConceded}`);

                const statsPlayerEmbed = new EmbedBuilder()
                .setColor("White")
                .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                .setTitle(`🏆 ${usernamePlayer} Statistics 🏆`)
                .setDescription(`${codeBlockStatsMessage}`)
                .setTimestamp()
	            .setFooter({ text: 'Created by .zenta.' });

                const userMessage = await user.send({
                    embeds: [statsPlayerEmbed],
                    components: [],
                });

                const codeBlockSuccesFindAccoundMessage = codeBlock(`✔️ Account found in the database`);

                const statsFindEmbed = new EmbedBuilder()
                .setColor("Green")
                .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                .setDescription(`${codeBlockSuccesFindAccoundMessage}`)
                .setTimestamp()
	            .setFooter({ text: 'Created by .zenta.' });

                const goToStats = new ButtonBuilder()
			    .setLabel('Go to stats')
                .setURL(userMessage.url)
			    .setStyle(ButtonStyle.Link);

                const row = new ActionRowBuilder()
                .addComponents(goToStats);

                return interaction.editReply({
                    content: `${user}`,
                    embeds: [statsFindEmbed],
                    components: [row],
                    ephemeral: true
                });
            } 
        } catch (error) {
            
            if (error.message === 'Cannot send messages to this user') {
                
                const userStats = await Player.findOne({ where: { id: playerStats } });

                const usernamePlayer = userStats.get('username');
                const eloPlayer = userStats.get('elo');
                const winPlayer = userStats.get('wins');
                const loosePlayer = userStats.get('losses');
                const gamesPlayed = userStats.get('games');
                const winratePlayer = userStats.winrate;
                const goalsScored = userStats.get('goalsScored');
                const goalsConceded = userStats.get('goalsConceded');
                const goalRatio = userStats.goalRatio;

                const codeBlockStatsMessage = codeBlock(`Username: ${usernamePlayer}\nElo: ${eloPlayer}\nWin Rate: ${winratePlayer}%\nWins: ${winPlayer}\nLosses: ${loosePlayer}\nGames played: ${gamesPlayed}\nGoal Ratio: ${goalRatio}\nGoals scored: ${goalsScored}\nGoals conceded: ${goalsConceded}`);

                const dmErrorMessage = codeBlock(`⚠️ Cannot send you a private message. Please check your privacy settings.`);

                const dmErrorEmbed = new EmbedBuilder()
                .setColor("Orange")
                .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                .setDescription(`${dmErrorMessage}\n\n🏆 **${usernamePlayer} Statistics** 🏆\n${codeBlockStatsMessage}`)
                .setTimestamp()
                .setFooter({ text: 'Created by .zenta.' });

                await interaction.editReply({
                    content: `${user}`,
                    embeds: [dmErrorEmbed],
                    components: [],
                    ephemeral: true
                });

                return;
            
            }
            
            console.error(error);

            const codeBlockErrorCommandMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);

            const ErrorCommandEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
            .setDescription(`${codeBlockErrorCommandMessage}`)
            .setTimestamp()
	        .setFooter({ text: 'Created by .zenta.' });

            return interaction.editReply({
                content: `${user}`,
                embeds: [ErrorCommandEmbed],
                components: [],
                ephemeral: true
            });        
        }
        
        const codeBlockErrorFindAccoundMessage = codeBlock(`❌ Could not find this account in the database`);

        const statsErrorFindEmbed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
        .setDescription(`${codeBlockErrorFindAccoundMessage}`)
        .setTimestamp()
	    .setFooter({ text: 'Created by .zenta.' });

        return interaction.editReply({
            content: `${user}`,
            embeds: [statsErrorFindEmbed],
            components: [],
            ephemeral: true
        });        
	}
}