module.exports = {
	name: 'prefix',
	aliases: false,
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: 'Show server prefix.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Prefix Command ~~");

		const botConfig = param.botConfig;
		const serverConfig = param.serverConfig;
		const getEmbed = param.getEmbed;
		const author = message.author;

		let prefixEmbed;
		if (message.guild) {
			prefixEmbed = getEmbed.execute(param, author, botConfig.infoColor, "", `**${message.guild.name}** prefix is \`${serverConfig.prefix}\`.`);
		} else {
			prefixEmbed = getEmbed.execute(param, author, botConfig.infoColor, "", `**${serverConfig.serverID}** prefix is \`${serverConfig.prefix}\`.`);
		}
		replyChannel.send(prefixEmbed);
	}
};
