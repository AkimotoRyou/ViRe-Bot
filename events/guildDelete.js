module.exports = {
	event: 'guildDelete',
	once: false,
	async execute(param, ...args) {
		console.log("\n~~ Leave a Guild ~~");

		const client = param.client;
		const botConfig = param.botConfig;
		const getEmbed = param.getEmbed;
		const guild = args[0];
		const ownerDM = await client.users.fetch(botConfig.ownerID);
		const ServerConfigsDB = param.ServerConfigsDB;
		const serverConfigColl = param.serverConfigColl;

		const fields = [`Server Name;${guild.name}`, `Server ID;${guild.id}`]
		const dmEmbed = getEmbed.execute(param, guild, botConfig.infoColor, "Leaving a server", "", fields);

		const rowCount = await ServerConfigsDB.destroy({ where: { serverID: guild.id } });
		if (rowCount > 0) {
			delete serverConfigColl[guild.id];
			console.log(`> Removed ${guild.name} from database.`);
		}
		await ownerDM.send(dmEmbed);
		console.log(`> Leaving ${guild.name} server.`);
	}
}