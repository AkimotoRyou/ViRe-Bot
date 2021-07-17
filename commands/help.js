module.exports = {
	name: 'help',
	aliases: ['h', 'commands', 'cmd'],
	level: 'User',
	guildOnly: false,
	args: false,
	usage: ['[command-name]'],
	description: 'List of all available commands based on your permission level.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Help Command ~~");

		const botConfig = param.botConfig;
		const serverConfig = param.serverConfig;
		const getEmbed = param.getEmbed;
		const commands = param.client.commands;
		const member = message.member;

		// collections
		const ownerCollection = commands.filter(command => command.level === 'Owner');
		const ownerLevel = ownerCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const ownerField = `~ Owner Level ~;${ownerLevel || "[empty]"}`;
		const adminCollection = commands.filter(command => command.level === 'Admin');
		const adminLevel = adminCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const adminField = `~ Admin Level ~;${adminLevel || "[empty]"}`;
		const moderatorCollection = commands.filter(command => command.level === 'Moderator');
		const moderatorLevel = moderatorCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const moderatorField = `~ Moderator Level ~;${moderatorLevel || "[empty]"}`;
		const userCollection = commands.filter(command => command.level === 'User');
		const userLevel = userCollection.map(command => `**${command.name}** : ${command.description}`).join('\n');
		const userField = `~ User Level ~;${userLevel || "[empty]"}`;

		// embed
		const description = `Use \`${serverConfig.prefix}help [commandName]\` to get more information about each command.`;
		const ownerEmbed = getEmbed.execute(param, member, botConfig.infoColor, "", description, [ownerField, adminField, moderatorField, userField]);
		const adminEmbed = getEmbed.execute(param, member, botConfig.infoColor, "", description, [adminField, moderatorField, userField]);
		const moderatorEmbed = getEmbed.execute(param, member, botConfig.infoColor, "", description, [moderatorField, userField]);
		const userEmbed = getEmbed.execute(param, member, botConfig.infoColor, "", description, [userField]);
		const notCmdEmbed = getEmbed.execute(param, member, botConfig.warningColor, "Not a Command", `That's not a valid command name or alias.\nUse \`${serverConfig.prefix}help\` to show available commands.`);

		if(!args.length) {
			if (botConfig.ownerID == message.author.id) {
				console.log("> Owner command list");
				return replyChannel.send(ownerEmbed);
			} else if (member.hasPermission("ADMINISTRATOR")) {
				console.log("> Admin command list");
				return replyChannel.send(adminEmbed);
			} else if (serverConfig.modRoles.length != 0) {
				const modRoles = serverConfig.modRoles;
				const authorRoles = message.member.roles;
				if (modRoles.some(roleID => authorRoles.cache.get(roleID))) {
					console.log("> Moderator command list");
					return replyChannel.send(moderatorEmbed);
				} else {
					console.log("> User command list");
					return replyChannel.send(userEmbed);
				}
			} else {
				console.log("> User command list");
				return replyChannel.send(userEmbed);
			}
		} else {
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

			if(!command) {
				return replyChannel.send(notCmdEmbed);
			}

			const data = [];
			data.push(`**Name** : ${command.name}`);
			if (command.aliases) data.push(`**Aliases** : ${command.aliases.join(', ')}`);
			if(command.guildOnly) {
				data.push(`**Direct Message** : false`);
			} else {
				data.push(`**Direct Message** : true`);
			}
			if (command.level) {
				data.push(`**Permission Level** : ${command.level}`);
			} else {
				data.push(`**Permission Level** : User`);
			}
			if (command.usage) {
				const usages = [];
				for (let i = 0;i < command.usage.length; i++) {
					usages.push(`\`${serverConfig.prefix}${command.name} ${command.usage[i]}\``);
				}
				data.push(`**Usage** : ${usages.join(', ')}`);
			} else {
				data.push(`**Usage** : \`${serverConfig.prefix}${command.name}\``);
			}
			if (command.description) data.push(`**Description** : ${command.description}`);
			if (command.note) data.push(`**Note** : \n\`${command.note}\``);

			const dataEmbed = getEmbed.execute(param, member, botConfig.infoColor, "Command Info", data.join('\n'));
			console.log(`> ${command.name} Command info`);
			replyChannel.send(dataEmbed);
		}
	}
};
