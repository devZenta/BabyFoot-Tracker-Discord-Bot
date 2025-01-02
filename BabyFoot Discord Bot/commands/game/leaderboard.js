const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const Player = require('../../models/player');

require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Display the leaderboard'),
	async execute(interaction) {

		const user = interaction.user;

		try {
			
			const players = await Player.findAll({
				order: [['elo', 'DESC']],
				limit: 10,
			});

			const playersCount = players.length;

			if (playersCount === 0) {

				const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ No player found ]`);

				const ErrorReplyEmbed = new EmbedBuilder()
				.setColor("Red")
				.setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
				.setDescription(`${codeBlockErrorMessage}`)
				.setTimestamp()
				.setFooter({ text: 'Created by .zenta.' });

				await interaction.reply({ 
					content: `${user}`, 
					embeds: [ErrorReplyEmbed],
					components: [],
					ephemeral: true
				});

				return;
			}
	
			const leaderboardEmbed = new EmbedBuilder()
				.setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
				.setTitle('🏆 Leaderboard 🏆')
				.setDescription('*Top 10 players*')
				.setColor("Aqua")
				.setTimestamp()
				.setFooter({ text: 'Created by .zenta.' });
	
			players.forEach((players, index) => {
				const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
				const contentMessage = `Elo: ${players.elo}, W: ${players.wins}, L: ${players.losses}, G: ${players.games}, WR: ${players.winrate}%, GR: ${players.goalRatio}`;
				const fieldContentMessage = codeBlock(contentMessage);
				leaderboardEmbed.addFields({
					name: `${medal} #${index + 1} ${players.username}`, 
					value: fieldContentMessage, 
					inline: false});
			});	
	
			await interaction.reply({ 
				embeds: [leaderboardEmbed], 
				components: [], 
				ephemeral: false
			});

		} catch (error) {

			console.error(error);

            const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);

            const ErrorReplyEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
            .setDescription(`${codeBlockErrorMessage}`)
            .setTimestamp()
	        .setFooter({ text: 'Created by .zenta.' });

            return interaction.reply({
                content: `${user}`,
                embeds: [ErrorReplyEmbed],
                components: [],
                ephemeral: true
            });  
		}
	},
};