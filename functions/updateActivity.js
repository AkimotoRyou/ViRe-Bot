module.exports = {
	name: "updateActivity",
	async execute(param) {
		const client = param.client;
		const botConfig = param.botConfig;
		const prefix = param.serverConfigColl["default"].prefix;

		if (botConfig.maintenance == 0) {
			client.user.setActivity(`${prefix}help | @${client.user.username} help`);
		} else {
			client.user.setActivity("~ [Maintenance] ~");
		}
		console.log(`> Activity Updated.`)
	}
};
