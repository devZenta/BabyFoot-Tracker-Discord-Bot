const { SlashCommandBuilder, codeBlock, EmbedBuilder } = require('discord.js');
const Player = require('../../models/player');
const GameHistory = require('../../models/gameHistory');

require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-bdd')
		.setDescription('Delete all data from the database')
        .addStringOption(option =>
            option.setName('table')
                .setDescription('The table you want to delete')
                .setRequired(true)
                .addChoices(
                    { name: 'Player', value: 'Player data' },
                    { name: 'GameHistory', value: 'Match data' },
                )),
	async execute(interaction) {

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

            return;

        } else if (userId === process.env.ADMIN_USER_ID) {

            const table = interaction.options.getString('table');

            if (table === 'Player data') {

                try {

                    await Player.drop();

                    const codeBlockSuccessMessage = codeBlock(`✅ Player Table has been deleted successfully.`);

                    const successDeleteTableEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${codeBlockSuccessMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [successDeleteTableEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    console.error(error);

                    const errorDeleteTableMessage = codeBlock(`⚠️ Player Table Error : [ ${error.message} ]`);

                    const errorDeleteTableEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${errorDeleteTableMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });
                    
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [errorDeleteTableEmbed],
                        ephemeral: true 
                    });

                    return;

                }

            } else if (table === 'Match data') {

                try {

                    await GameHistory.drop();

                    const codeBlockSuccessMessage = codeBlock(`✅ GameHistory Table has been deleted successfully.`);

                    const successDeleteTableEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${codeBlockSuccessMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });
            
                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [successDeleteTableEmbed],
                        ephemeral: true 
                    });

                    return;

                } catch (error) {

                    console.error(error);

                    const errorDeleteTableMessage = codeBlock(`⚠️ GameHistory Table Error : [ ${error.message} ]`);

                    const errorDeleteTableEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${errorDeleteTableMessage}`)
                    .setTimestamp()
	                .setFooter({ text: 'Created by .zenta.' });

                    await interaction.reply({ 
                        content: `${interaction.user}`, 
                        embeds: [errorDeleteTableEmbed],
                        ephemeral: true 
                    });

                    return;
                }
            }
        }
    }
}