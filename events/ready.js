module.exports = {
	event: 'ready',
	once: false,
	async execute(param, ...args) {
		console.log("\n~~ READY ~~");

		const client = param.client;
		const user = client.user;

		await param.BotConfigDB.sync();
		await param.ServerConfigsDB.sync();
		await param.ModLogsDB.sync();
		await param.botConfigSync.execute(param);
		await param.serverConfigSync.execute(param);

		console.log(`> Logged in as ${user.tag}.`);
	}
}