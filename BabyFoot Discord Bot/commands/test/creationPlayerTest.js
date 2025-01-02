const { SlashCommandBuilder, EmbedBuilder, codeBlock } = require('discord.js');
const Player = require('../../models/player');

require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('creation-player-test')
		.setDescription('Create an account'),
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

            const privateGuildId = process.env.PRIVATE_GUILD_ID; 
            const privateChannelId = process.env.PRIVATE_CHANNEL_ID;

            const privateGuild = await interaction.client.guilds.fetch(privateGuildId);
            const privateChannel = privateGuild.channels.cache.get(privateChannelId);

            const codeBlockReportUserMessage = codeBlock(`⚠️ The user ${interaction.user.tag} attempted to execute an admin command. (/creation-player-test)`);

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
            
            const playerId = 1;
            const playerUsername = 'user-test-1';

            try {
                
                const player = await Player.create({
                    id: playerId,
                    username: playerUsername,
                });

                const codeBlockSuccessMessage = codeBlock(`✔️ Success : [ Player ${player.username} created ]`);

                const SuccessEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ name: 'BabyFoot Tracker', iconURL: process.env.LOGO_URL, url: process.env.GITHUB_URL })
                    .setDescription(`${codeBlockSuccessMessage}`)
                    .setTimestamp()
                    .setFooter({ text: 'Created by .zenta.' });
            
                await interaction.reply({ 
                    content: `${interaction.user}`, 
                    embeds: [SuccessEmbed],
                    ephemeral: true 
                });

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
}