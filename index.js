const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const token = process.env.TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const app = express();
app.use(bodyParser.json());
const port = 3001;

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

app.post('/send-welcome', async (req, res) => {
	const { discordId, message } = req.body;
  
	if (!discordId || !message) {
	  return res.status(400).json({ error: 'discordId et message sont requis' });
	}
  
	try {
	  const user = await client.users.fetch(discordId);
	  if (!user) {
		return res.status(404).json({ error: 'Utilisateur non trouvé' });
	  }
	  
	  // Envoie un message de bienvenue à l'utilisateur
	  await user.send(message);
	  res.json({ status: 'Message envoyé avec succès' });
	} catch (error) {
	  console.error('Erreur lors de l\'envoi du message:', error);
	  res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
	}
  });

  client.login(token).then(() => {
	app.listen(port, () => {
	  console.log(`Bot Discord API listening at http://localhost:${port}`);
	});
  });