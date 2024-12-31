const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, codeBlock } = require('discord.js');
const Player = require('../../models/player');

require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create-account')
		.setDescription('Create an account'),
	async execute(interaction) {

        const user = interaction.user;
        const userId = interaction.user.id;
        const username = interaction.user.username;

        const confirmationMessage = codeBlock(`Press the confirmation button to create an account.`);

        const createAccountEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
        .setDescription(`${confirmationMessage}`)
        .setTimestamp()
	    .setFooter({ text: 'Created by .zenta.' });

        const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Success);

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(confirm, cancel);

        const response = await interaction.reply({
            content: `${user}`,
            embeds: [createAccountEmbed],
            components: [row],
            ephemeral: true
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {

            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if (confirmation.customId === 'confirm') {

                try {

                    const player = await Player.create({
                        id: userId,
                        username: username,
                    })

                    const confirmCreationAccountMessage = codeBlock(`✔️ ${player.username} your account has been created`);

                    const confirmCreationAccountEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${confirmCreationAccountMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    const playerStats = await Player.findOne({ where: { id: userId } });

                    const usernamePlayer = playerStats.get('username');
                    const eloPlayer = playerStats.get('elo');
                    const winPlayer = playerStats.get('wins');
                    const loosePlayer = playerStats.get('losses');
                    const gamesPlayed = playerStats.get('games');
                    const winratePlayer = playerStats.winrate;
                    const goalsScored = playerStats.get('goalsScored');
                    const goalsConceded = playerStats.get('goalsConceded');
                    const goalRatio = playerStats.goalRatio;

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

                    const goToStats = new ButtonBuilder()
			        .setLabel('Go to stats')
                    .setURL(userMessage.url)
			        .setStyle(ButtonStyle.Link);

                    const row = new ActionRowBuilder()
                    .addComponents(goToStats);

                    await confirmation.update({
                        content: `${user}`,
                        embeds: [confirmCreationAccountEmbed],
                        components: [row],
                        ephemeral: true
                    });

                    return;

                }
                catch (error) {

                    if (error.name === 'SequelizeUniqueConstraintError') {

                        const uniqueAccountErrorMessage = codeBlock(`⛔ You are already registered.`);

                        const uniqueAccountErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${uniqueAccountErrorMessage}`)
                        .setTimestamp()
	                    .setFooter({ text: 'Created by .zenta.' });

                        return confirmation.update({
                            content: `${user}`,
                            embeds: [uniqueAccountErrorEmbed],
                            components: [],
                            ephemeral: true
                        });

                    } else if (error.message === 'Cannot send messages to this user') {

                        const playerStats = await Player.findOne({ where: { id: userId } });

                        const usernamePlayer = playerStats.get('username');
                        const eloPlayer = playerStats.get('elo');
                        const winPlayer = playerStats.get('wins');
                        const loosePlayer = playerStats.get('losses');
                        const gamesPlayed = playerStats.get('games');
                        const winratePlayer = playerStats.winrate;
                        const goalsScored = playerStats.get('goalsScored');
                        const goalsConceded = playerStats.get('goalsConceded');
                        const goalRatio = playerStats.goalRatio;

                        const codeBlockStatsMessage = codeBlock(`Username: ${usernamePlayer}\nElo: ${eloPlayer}\nWin Rate: ${winratePlayer}%\nWins: ${winPlayer}\nLosses: ${loosePlayer}\nGames played: ${gamesPlayed}\nGoal Ratio: ${goalRatio}\nGoals scored: ${goalsScored}\nGoals conceded: ${goalsConceded}`);

                        const dmErrorMessage = codeBlock(`⚠️ Cannot send you a private message. Please check your privacy settings.\n\n✔️ ${usernamePlayer} your account has been created`);
                    
                        const dmErrorEmbed = new EmbedBuilder()
                        .setColor("Orange")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${dmErrorMessage}\n\n🏆 **${usernamePlayer} Statistics** 🏆\n${codeBlockStatsMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });

                        await confirmation.update({
                            content: `${user}`,
                            embeds: [dmErrorEmbed],
                            components: [],
                            ephemeral: true
                        });

                        return;
                    }
                    
                    console.error(error);

                    const registerErrorMessage = codeBlock(`There was a problem creating your account. Please try again.`);
                    const replyError = codeBlock(`⚠️ Error : [ ${error.message} ]`);

                    const registerErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${registerErrorMessage}.\n${replyError}`)
                        .setTimestamp()
	                    .setFooter({ text: 'Created by .zenta.' });
                    
                    return confirmation.update({
                        content: `${user}`,
                        embeds: [registerErrorEmbed],
                        components: [],
                        ephemeral: true
                    });
                }
            } else if (confirmation.customId === 'cancel') {

                const cancelMessage = codeBlock(`❌ Operation canceled.`);

                const cancelCreationAccountEmbed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                .setDescription(`${cancelMessage}`)
                .setTimestamp()
	            .setFooter({ text: 'Created by .zenta.' });

                return confirmation.update({
                    content: `${user}`,
                    embeds: [cancelCreationAccountEmbed],
                    components: [],
                    ephemeral: true
                });
            }
        } catch (e) {

            if (e.message === 'Collector received no interactions before ending with reason: time') {

                const errorTimeMessage = codeBlock(`⚠️ Error : [ The command has been canceled because you did not confirm in time ]`);

                const errorTimeCommandEmbed = new EmbedBuilder()
                .setColor("Red")
                .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                .setDescription(`${errorTimeMessage}`)
                .setTimestamp()
	            .setFooter({ text: 'Created by .zenta.' });

                await interaction.editReply({
                    content: `${user}`,
                    embeds: [errorTimeCommandEmbed],
                    components: [],
                    ephemeral: true
                });

                return;

            }

            console.log(e);

            const errorMessage = codeBlock(`⚠️ Error : [ ${e.message} ]`);

            const errorCommandEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
            .setDescription(`${errorMessage}`)
            .setTimestamp()
	        .setFooter({ text: 'Created by .zenta.' });

            await interaction.editReply({
                content: `${user}`,
                embeds: [errorCommandEmbed],
                components: [],
                ephemeral: true
            });
        }
    }
};