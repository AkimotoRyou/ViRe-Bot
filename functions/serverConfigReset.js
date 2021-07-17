module.exports = {
	name: "serverConfigReset",
	async execute(param, serverID, resetName) {
		console.log("\n~~ Server Config Reset ~~");

		const defaultConfig = param.defaultConfig;
		const ServerConfigsDB = param.ServerConfigsDB;

		const getServerConfig = await ServerConfigsDB.findOne({ where: { serverID: serverID } });
		if (getServerConfig) {
			if (resetName && resetName !== "all") {
				console.log(`Updating ${resetName} to ${defaultConfig[resetName]}`);
				getServerConfig[resetName] = defaultConfig[resetName];
				await getServerConfig.save;
			} else {
				getServerConfig.prefix = defaultConfig.prefix;
				getServerConfig.cooldown = defaultConfig.cooldown;
				getServerConfig.modLogCh = defaultConfig.modLogCh,
				getServerConfig.entryLogCh = defaultConfig.entryLogCh,
				getServerConfig.modRoles = defaultConfig.modRoles;
				getServerConfig.botChannels = defaultConfig.botChannels;
				getServerConfig.blacklist = defaultConfig.blacklist;
				await getServerConfig.save;
			}
		} else {
			await ServerConfigsDB.create({
				serverID : serverID,
				prefix : defaultConfig.prefix,
				cooldown : defaultConfig.cooldown,
				modLogCh : defaultConfig.modLogCh,
				entryLogCh : defaultConfig.entryLogCh,
				modRoles : defaultConfig.modRoles,
				botChannels : defaultConfig.botChannels,
				blacklist : defaultConfig.blacklist,
			})
		}
		return param.serverConfigSync.execute(param, serverID);
	}
};
