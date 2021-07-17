module.exports = {
	name: "serverConfigSync",
	async execute(param) {
		console.log("\n~~ Server Config Sync ~~");

		const ServerConfigsDB = param.ServerConfigsDB;
		const serverConfigColl = param.serverConfigColl;
		const serverIDColl = await ServerConfigsDB.findAll({ attributes: ["serverID"] });
		const serverIDlist = serverIDColl.map(config => config.serverID);

		const syncPromise = new Promise(resolve => {
			async function forLoop() {
				serverIDlist.forEach(async serverID => {
					const getConfig = await ServerConfigsDB.findOne({ where: { serverID: serverID } });
					const tempConfig = {
						serverID: "",
						prefix: "",
						cooldown: "",
						modLogCh : "",
						entryLogCh : "",
						modRoles: [],
						botChannels: [],
						blacklist: []
					}
					const configKeys = Object.keys(tempConfig);
					for (let i = 0; i < configKeys .length; i++) {
						console.log(`Syncing '${configKeys[i]}' in (${getConfig.serverID}) server config to [${getConfig[configKeys[i]]}].`)
						tempConfig[configKeys[i]] = getConfig[configKeys[i]] || "empty";
					}
					serverConfigColl[serverID] = tempConfig;
					param.serverConfig = serverConfigColl[serverID];
					resolve("[Synced]");
				})
			}
			forLoop();
		});
		syncPromise.then(input => {
			console.log(input);
		});
	}
};
