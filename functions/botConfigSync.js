module.exports = {
	name: "botConfigSync",
	async execute(param) {
		console.log("\n~~ Bot Config Sync ~~");

		const BotConfigDB = param.BotConfigDB;

		console.log("[Syncing Configuration]");

		const configKeys = Object.keys(param.botConfig);
		const syncPromise = new Promise(resolve => {
			try {
				async function forLoop() {
					for (let i = 0; i < configKeys .length; i++) {
						const getConfig = await BotConfigDB.findOne({ where: { name: configKeys[i] } });
						if(getConfig) {
							console.log(`Syncing ${getConfig.name}...`)
							param.botConfig[configKeys[i]] = getConfig.value || "empty";
						} else {
							// resolved too cause im still confused with reject()
							console.log("Calling reset function...")
							await param.botConfigReset.execute(param);
							break;
						}
					}
					resolve();
				}
				forLoop().then(() => {
					param.updateActivity.execute(param);
				});
			} catch (error) {
				return console.log(error);
			}
		});
		syncPromise.then(() => {
			console.log("[Synced]");
		});
	}
};
