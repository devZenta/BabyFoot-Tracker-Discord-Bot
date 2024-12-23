const { Events, ActivityType } = require('discord.js');
const Player = require('../models/player');
const GameHistory = require('../models/gameHistory');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {

		const status = [
			{
				name: 'Created by zenta .',
				type: ActivityType.Playing,
			},
			{
				name: 'IN WORK',
				type: ActivityType.Playing,
			},
			{
				name: 'Discord Bot for managing games of table football ',
				type: ActivityType.Playing,
			},
			{
				name: `${client.guilds.cache.size} servers`,
				type: ActivityType.Listening,
			},
		];


		setInterval(() => {
			const random = Math.floor(Math.random() * status.length);
			client.user.setActivity(status[random].name, { type: status[random].type });
			client.user.setStatus('online');
		}, 3000);


		Player.sync()
			.then(() => {
				console.log('     ╔══════════════════════════════════════════════════╗');
				console.log('     ║    Player model synchronized successfully.       ║');
				console.log('     ╚══════════════════════════════════════════════════╝');
			})
			.catch((error) => {
				console.error('     ╔══════════════════════════════════════════════════╗');
                console.error('     ║    Error synchronizing Player model:             ║');
                console.error('     ╚══════════════════════════════════════════════════╝');
				console.error(error);
			});

		/*GameHistory.sync()
			.then(() => {
				console.log('     ╔══════════════════════════════════════════════════╗');
				console.log('     ║    GameHistory model synchronized successfully.  ║');
				console.log('     ╚══════════════════════════════════════════════════╝');
			})
			.catch((error) => {
				console.error('     ╔══════════════════════════════════════════════════╗');
                console.error('     ║    Error synchronizing GameHistory model:        ║');
                console.error('     ╚══════════════════════════════════════════════════╝');
				console.error(error);
			})*/

		console.log('     ╔══════════════════════════════════════════════════╗');
		console.log(`     ║    Logged in as ${client.user.tag}            ║`);
		console.log('     ╚══════════════════════════════════════════════════╝');
	},
};