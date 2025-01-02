const { SlashCommandBuilder, codeBlock } = require('discord.js');

require('dotenv').config();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Help command'),
	async execute(interaction) {

        await interaction.reply({
            content: codeBlock(`Command in dev...`),
            ephemeral: true
        });

    }
}