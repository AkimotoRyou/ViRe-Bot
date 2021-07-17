module.exports = {
	event: 'message',
	once: false,
	async execute(param, ...args) {
		console.log("\n~~ Message ~~");

		const Discord = param.Discord;
		const client = param.client;
		const botConfig = param.botConfig;
		const serverConfigColl = param.serverConfigColl;
		const MessageAttachment = param.MessageAttachment;
		const message = args[0];
		const getEmbed = param.getEmbed;
		const author = message.author;

		if(message.author.bot) return console.log(`> Message author [${message.author.tag}] is a bot.`);
		if(botConfig.maintenance !== "0" && botConfig.ownerID !== message.author.id) return console.log("> Maintenance." + botConfig.maintenance);

		if(!message.guild) {
			if(param.serverConfig.serverID !== "default") {
				param.serverConfig = serverConfigColl["default"];
			}
		} else if(param.serverConfig.serverID !== message.guild.id) {
			if (!serverConfigColl[message.guild.id]) {
				await param.serverConfigReset.execute(param, message.guild.id);
				param.serverConfig = serverConfigColl["default"];
			} else {
				param.serverConfig = serverConfigColl[message.guild.id];
			}
		}
		const serverConfig = param.serverConfig;

		try {
			const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(serverConfig.prefix)})\\s*`);

			const blacklist = serverConfig.blacklist;
			let edit = message.content;
			if(message.guild) {
				for (let i = 0; i < blacklist.length; i++) {
					edit = edit.replace(new RegExp(blacklist[i], 'gi'), "`censor`");
				}
				if(edit != message.content) {
					message.channel.send(`\`${message.author.username}\` : ${edit}`);
					if (message.attachments.size > 0) {
						await message.attachments.forEach(async atch => {
							const attachment = new MessageAttachment(atch.url);
							await message.channel.send(attachment);
						});
					}
					message.delete();
					console.log(`> Censored ${message.author.tag} message.`);
				}
			}

			if(!prefixRegex.test(message.content)) return console.log('> No prefix.');

			const [, matchedPrefix] = message.content.match(prefixRegex);
			const msgArgs = message.content.slice(matchedPrefix.length).trim().split(/ +/);
			const commandName = msgArgs.shift().toLowerCase();

			console.log(`> ${message.author.tag} calling [${commandName}] command.`);

			const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return console.log(`> Can't find [${commandName}] command.`);

			// Command Cooldown
			const cooldowns = client.cooldowns;
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = serverConfig.cooldown * 1000;

			if (timestamps.has(message.author.id)) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
				if (now < expirationTime) return console.log("> Command cooldown.");
			}

			timestamps.set(message.author.id, now);
			setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

			if(command.guildOnly && message.channel.type !== 'text' && message.author.id != botConfig.ownerID) {
				const noDMEmbed = getEmbed.execute(param, author, botConfig.errorColor, "Command Unavailable", "This command can't be used inside Direct Message.");
				const noConfigEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Server Configuration Not Found", `This server config is just generated, please try the command again.`);
				if (message.guild && serverConfig.serverID == "default") {
					return message.channel.send(noConfigEmbed);
				} else {
					return message.channel.send(noDMEmbed);
				}
			}

			if(command.args && !args.length) {
				const description = "You didn't provide any arguments."
				let usage, note = "";

				if(command.usage) {
					usage = `Usage;${serverConfig.prefix}${command.name} ${command.usage}`;
				}
				if(command.note) {
					note = `Note;${command.note}`;
				}

				const noArgsEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Missing Arguments", description, [usage, note]);
				return message.channel.send(noArgsEmbed);
			}

			await param.commandHandler.execute(param, message, msgArgs, command);
		} catch (error) {
			console.log(`> An error occured.`);
			console.error(error);
			message.channel.send(`**An Error Occured**\nError Name : \`${error.name}\`\nError Message : \`${error.message}\``);
		}
	}
}