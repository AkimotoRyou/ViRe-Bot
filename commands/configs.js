module.exports = {
	name: 'configs',
	aliases: false,
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: 'Show bot and server configuration.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Configs Command ~~");

		const botConfig = param.botConfig;
		const serverConfig = param.serverConfig;
		const getEmbed = param.getEmbed;

		const botConfigKeys = Object.keys(botConfig);
		const serverConfigKeys = Object.keys(serverConfig);
		const botData = [];
		const serverData = [];

		botConfigKeys.forEach(key => {
			if (Array.isArray(botConfig[key]) && botConfig[key][0]) {
				botData.push(`**${key}** : ${botConfig[key].map(content => `\`${content}\``).join(', ')}`);
			} else {
				botData.push(`**${key}** : ${botConfig[key] || "[empty]"}`);
			}
		});
		serverConfigKeys.forEach(key => {
			if (key == "modRoles" && serverConfig[key][0]) {
				serverData.push(`**${key}** : ${serverConfig[key].map(content => `<@&${content}> \`[${content}]\``).join(', ')}`);
			} else if (key == "botChannels" && serverConfig[key][0]) {
				serverData.push(`**${key}** : ${serverConfig[key].map(content => `<#${content}> \`[${content}]\``).join(', ')}`);
			} else if (Array.isArray(serverConfig[key]) && serverConfig[key][0]) {
				serverData.push(`**${key}** : ${serverConfig[key].map(content => `\`${content}\``).join(', ')}`);
			} else if (key == "cooldown") {
				serverData.push(`**${key}** : ${serverConfig[key] + " seconds"}`);
			} else if (key == "modLogCh" || key == "entryLogCh") {
				if (serverConfig[key] !== "empty") {
					serverData.push(`**${key}** : <#${serverConfig[key]}> \`[${serverConfig[key]}]\``);
				} else {
					serverData.push(`**${key}** : `);
				}
			} else {
				serverData.push(`**${key}** : ${serverConfig[key]}`);
			}
		});

		const configEmbed = getEmbed.execute(param, message.author, botConfig.infoColor, "", "", [`Bot Configs;${botData.join('\n')}`, `Server Configs;${serverData.join('\n')}`]);
		replyChannel.send(configEmbed);
		return console.log("> Configuration list");
	}
};
