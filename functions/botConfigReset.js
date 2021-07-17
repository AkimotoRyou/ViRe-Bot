module.exports = {
	name: "botConfigReset",
	async execute(param, resetName) {
		console.log("\n~~ Bot Config Reset ~~");

		const defaultConfig = param.defaultConfig;
		const BotConfigDB = param.BotConfigDB;
		const configKeys = Object.keys(param.botConfig);

		const resetPromise = new Promise(resolve => {
			async function asyncFn() {
				if (resetName && resetName !== "all") {
					console.log(`Updating ${resetName} to ${defaultConfig[resetName]}`);
					await BotConfigDB.update(
						{ value: defaultConfig[resetName] },
						{ where: { name: resetName } }
					);
					resolve();
				} else {
					for (let i = 0; i < configKeys.length; i++) {
						try {
							// Create new row on config.sqlite
							console.log(`Trying to add ${configKeys[i]} to Database`);
							await BotConfigDB.create({
								name: configKeys[i],
								value: defaultConfig[configKeys[i]]
							});
						} catch (error) {
							// Edit the value in config.sqlite with the one from config.js
							if (error.name === "SequelizeUniqueConstraintError") {
								console.log(`Updating ${configKeys[i]} to ${defaultConfig[configKeys[i]]}`);
								await BotConfigDB.update(
									{ value: defaultConfig[configKeys[i]] },
									{ where: { name: configKeys[i] } }
								);
							}
						}
					}
					resolve();
				}
			}
			asyncFn();
		});
		resetPromise.then(() => {
			return param.botConfigSync.execute(param);
		});
	}
};
