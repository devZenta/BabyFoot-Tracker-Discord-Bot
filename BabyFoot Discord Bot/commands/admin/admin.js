const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const { checkPlayerExists, updatePlayerUsername, updatePlayerElo, updatePlayerWins, updatePlayerLosses, updatePlayerGamesPlayed, updatePlayerGoalsConceded, updatePlayerGoalsScored, getPlayerById } = require('../../utils/functions'); 

require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin command')
        .addSubcommand(subcommand =>
            subcommand
                .setName('goals-scored')
                .setDescription('Update the goals scored by the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new goals scored count')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('goals-conceded')
                .setDescription('Update the goals conceded by the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new goals conceded count')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('username')
                .setDescription('Update the username of the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new username')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('elo')
                .setDescription('Update the elo of the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new elo')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('win')
                .setDescription('Update the win count of the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new win count')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('loose')
                .setDescription('Update the loose count of the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new loose count')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('game')
                .setDescription('Update the game count of the player')
                .addStringOption(option =>
                    option
                        .setName('id')
                        .setDescription('The id of the player')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName('value')
                        .setDescription('The new game count')
                        .setRequired(true))),
    async execute(interaction) { 

        const subcommand = interaction.options.getSubcommand();
        const userId = interaction.user.id;

        if (userId !== process.env.ADMIN_USER_ID) {

            const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ You are not an admin ]`);

            const ErrorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
            .setDescription(`${codeBlockErrorMessage}`)
            .setTimestamp()
	        .setFooter({ text: 'Created by .zenta.' });
            
            await interaction.reply({ 
                content: `${interaction.user}`, 
                embeds: [ErrorEmbed],
                ephemeral: true 
            });

            const privateGuildId = process.env.PRIVATE_GUILD_ID; 
            const privateChannelId = process.env.PRIVATE_CHANNEL_ID;

            const privateGuild = await interaction.client.guilds.fetch(privateGuildId);
            const privateChannel = privateGuild.channels.cache.get(privateChannelId);

            const codeBlockReportUserMessage = codeBlock(`⚠️ The user ${interaction.user.tag} attempted to execute an admin command. (/admin)`);

            const reportUserEmbed = new EmbedBuilder()
            .setColor("Red")
            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
            .setDescription(`${codeBlockReportUserMessage}`)
            .setTimestamp()
	        .setFooter({ text: 'Created by .zenta.' });

            if (privateChannel) {
                privateChannel.send({
                    embeds: [reportUserEmbed],
                    ephemeral: false
                });
            }

            return;

        } else if (userId === process.env.ADMIN_USER_ID) {
            
            if (subcommand === 'goals-scored') {

                const playerId = interaction.options.getString('id');
                const newGoalsScored = interaction.options.getInteger('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerGoalsScored(playerId, newGoalsScored);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username}\nElo: ${player.elo}\nWin Rate: ${player.winrate}%\nWins: ${player.wins}\nLosses: ${player.losses}\nGames played: ${player.games}\nGoal Ratio: ${player.goalRatio} ➡️ ${playerUpdate.goalRatio}\nGoals scored: ${player.goalsScored} ➡️ ${playerUpdate.goalsScored}\nGoals conceded: ${player.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Goals Scored updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }
            
            } else if (subcommand === 'goals-conceded') {

                const playerId = interaction.options.getString('id');
                const newGoalsConceded = interaction.options.getInteger('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerGoalsConceded(playerId, newGoalsConceded);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username}\nElo: ${player.elo}\nWin Rate: ${player.winrate}%\nWins: ${player.wins}\nLosses: ${player.losses}\nGames played: ${player.games}\nGoal Ratio: ${player.goalRatio} ➡️ ${playerUpdate.goalRatio}\nGoals scored: ${player.goalsScored}\nGoals conceded: ${player.goalsConceded} ➡️ ${playerUpdate.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Goals Conceded updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }


            } else if (subcommand === 'username') {

                const playerId = interaction.options.getString('id');
                const newUsername = interaction.options.getString('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerUsername(playerId, newUsername);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username} ➡️ ${playerUpdate.username}\nElo: ${player.elo}\nWin Rate: ${player.winrate}%\nWins: ${player.wins}\nLosses: ${player.losses}\nGames played: ${player.games}\nGoal Ratio: ${player.goalRatio}\nGoals scored: ${player.goalsScored}\nGoals conceded: ${player.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Username updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }

            } else if (subcommand === 'elo') {

                const playerId = interaction.options.getString('id');
                const newElo = interaction.options.getInteger('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerElo(playerId, newElo);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username}\nElo: ${player.elo} ➡️ ${playerUpdate.elo}\nWin Rate: ${player.winrate}%\nWins: ${player.wins}\nLosses: ${player.losses}\nGames played: ${player.games}\nGoal Ratio: ${player.goalRatio}\nGoals scored: ${player.goalsScored}\nGoals conceded: ${player.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Elo updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }
                
            } else if (subcommand === 'win') {

                const playerId = interaction.options.getString('id');
                const newWin = interaction.options.getInteger('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerWins(playerId, newWin);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username}\nElo: ${player.elo}\nWin Rate: ${player.winrate}% ➡️ ${playerUpdate.winrate}%\nWins: ${player.wins} ➡️ ${playerUpdate.wins}\nLosses: ${player.losses}\nGames played: ${player.games}\nGoal Ratio: ${player.goalRatio}\nGoals scored: ${player.goalsScored}\nGoals conceded: ${player.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Wins updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }

            } else if (subcommand === 'loose') {

                const playerId = interaction.options.getString('id');
                const newLoose = interaction.options.getInteger('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerLosses(playerId, newLoose);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username}\nElo: ${player.elo}\nWin Rate: ${player.winrate}%\nWins: ${player.wins}\nLosses: ${player.losses} ➡️ ${playerUpdate.losses}\nGames played: ${player.games}\nGoal Ratio: ${player.goalRatio}\nGoals scored: ${player.goalsScored}\nGoals conceded: ${player.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Losses updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }
                
            } else if (subcommand === 'game') {

                const playerId = interaction.options.getString('id');
                const newGame = interaction.options.getInteger('value');

                try {

                    const playerAccountExists = await checkPlayerExists(playerId);
            
                    if (!playerAccountExists) {
                        const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ Player does not exist ]`);
            
                        const ErrorEmbed = new EmbedBuilder()
                            .setColor("Red")
                            .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                            .setDescription(`${codeBlockErrorMessage}`)
                            .setTimestamp()
                            .setFooter({ text: 'Created by .zenta.' });
            
                        await interaction.reply({ 
                            content: `${interaction.user}`, 
                            embeds: [ErrorEmbed],
                            ephemeral: true 
                        });
            
                        return;
                    }

                    const player = await getPlayerById(playerId);
            
                    await updatePlayerGamesPlayed(playerId, newGame);

                    const playerUpdate = await getPlayerById(playerId);

                    const codeBlockStatsMessage = codeBlock(`Username: ${player.username}\nElo: ${player.elo}\nWin Rate: ${player.winrate}% ➡️ ${playerUpdate.winrate}%\nWins: ${player.wins}\nLosses: ${player.losses}\nGames played: ${player.games} ➡️ ${playerUpdate.games}\nGoal Ratio: ${player.goalRatio}\nGoals scored: ${player.goalsScored}\nGoals conceded: ${player.goalsConceded}`);

                    const commandMessage = codeBlock('✔️ Games updated successfully.');

                    const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${commandMessage}\n\n⚙️ **Here are the modified stats :**\n${codeBlockStatsMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [SuccessEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    const codeBlockErrorMessage = codeBlock(`⚠️ Error : [ ${error.message} ]`);
            
                    const ErrorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })    
                        .setDescription(`${codeBlockErrorMessage}`)
                        .setTimestamp()
                        .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [ErrorEmbed],
                        ephemeral: true 
                    });

                }
               
            } 
        }
    },
};