module.exports = {
	event: 'guildCreate',
	once: false,
	async execute(param, ...args) {
		console.log("\n~~ New Guild ~~");

		const client = param.client;
		const botConfig = param.botConfig;
		const getEmbed = param.getEmbed;
		const guild = args[0];
		const ownerDM = await client.users.fetch(botConfig.ownerID);

		const fields = [`Server Name;${guild.name}`, `Server ID;${guild.id}`]
		const dmEmbed = getEmbed.execute(param, guild, botConfig.infoColor, "Joined a server", "", fields);

		await param.serverConfigReset.execute(param, guild.id);
		await ownerDM.send(dmEmbed);
		console.log(`> Joined ${guild.name} server.`);
	}
}