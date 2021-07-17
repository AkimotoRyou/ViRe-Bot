module.exports = {
	name: 'setbot',
	aliases: ['sb'],
	level: 'Owner',
	guildOnly: false,
	args: true,
	usage: ['<config-name> <config-value>', 'reset [all|configName]'],
	description: 'Set bot configuration.',
	note: "- <config-name> value is case sensitive.",
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Setbot Command ~~");

		const client = param.client;
		const botConfigSync = param.botConfigSync;
		const BotConfigDB = param.BotConfigDB;
		const botConfig = param.botConfig;
		const botConfigKeys = Object.keys(botConfig).map(key => `\`${key}\``);
		const getEmbed = param.getEmbed;
		const author = message.author;

		const configName = args.shift();
		const configValue = args.shift();

		const invalidNameEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Name", `Can't find config named ${configName}.`, [`Available names;${botConfigKeys.join(', ')}`]);
		const invalidUserEmbed = getEmbed.execute(param, author, botConfig.warningColor, "User Not Found", `Can't find user with ID of \`${configValue}\`.`);
		const invalidColorEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Color Code", `Use hex code for \`<config-value>\`.<https://html-color.codes/>`)
		const emptyValueEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Empty Value", "The value can't be empty for this config.")

		switch(configName) {
		case 'ownerID' : {
			if (!client.users.cache.get(configValue)) {
				replyChannel.send(invalidUserEmbed);
				break;
			} else {
				await BotConfigDB.update({ value: configValue }, { where: { name: configName } });
				const updated = await BotConfigDB.findOne({ where: { name: configName } });
				const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${updated.name} to ${updated.value}.`);
				await botConfigSync.execute(param).then(() => {
					replyChannel.send(updatedEmbed);
				});
				break;
			}
		}
		case 'maintenance' : {
			if (configValue == 0 || configValue == 1) {
				await BotConfigDB.update({ value: configValue }, { where: { name: configName } });
			} else if (botConfig.maintenance == 0) {
				await BotConfigDB.update({ value: 1 }, { where: { name: configName } });
			} else {
				await BotConfigDB.update({ value: 0 }, { where: { name: configName } });
			}
			const updated = await BotConfigDB.findOne({ where: { name: configName } });
			const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${updated.name} to ${updated.value}.`);
			await botConfigSync.execute(param).then(() => {
				replyChannel.send(updatedEmbed);
			});
			break;
		}
		case 'infoColor' :
			// fallthrough
		case 'warningColor' :
			// fallthrough
		case 'errorColor' : {
			const colorTest = /^#[0-9A-F]{6}$/i;
			if (!configValue) {
				replyChannel.send(emptyValueEmbed);
				break;
			} else if(colorTest.test(configValue)) {
				await BotConfigDB.update({ value: configValue }, { where: { name: configName } });
				const updated = await BotConfigDB.findOne({ where: { name: configName } });
				const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${updated.name} to ${updated.value}.`);
				await botConfigSync.execute(param).then(() => {
					replyChannel.send(updatedEmbed);
				});
				break;
			} else {
				replyChannel.send(invalidColorEmbed);
				break;
			}
		}
		case 'reset' : {
			let resetName = configValue;
			if (!resetName) {
				resetName = "all";
			} else if (!botConfigKeys.includes(`\`${resetName}\``)) {
				return replyChannel.send(invalidNameEmbed);
			}
			const confirmEmbed = getEmbed.execute(param, author, botConfig.infoColor, 'Confirmation Needed', `Are you sure you want to reset ${resetName} config?`, false, `✅: Yes, ❌: No`);
			const cancelEmbed = getEmbed.execute(param, author, botConfig.warningColor, 'Action Cancelled');
			const successEmbed = getEmbed.execute(param, author, botConfig.infoColor, 'Success', `${resetName} config value(s) has been reset to default.`);

			const filter = (reaction, user) => {
				return user.id === author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌');
			}
			const botMsg = await replyChannel.send(confirmEmbed);
			await botMsg.react('✅');
			await botMsg.react('❌');

			botMsg.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
				.then(async collected => {
					if (collected.first().emoji.name == '❌') {
					// user react with ❌
						await botMsg.reactions.removeAll();
						await botMsg.edit(cancelEmbed);
					} else if (collected.first().emoji.name == '✅') {
						await botMsg.reactions.removeAll();
						await param.botConfigReset.execute(param, resetName).then(() => {
							return botMsg.edit(successEmbed);
						})
					}
				})
				.catch(collected => {
					botMsg.edit(cancelEmbed).then(() => {
						return botMsg.reactions.removeAll();
					});
				});
			break;
		}
		default : {
			replyChannel.send(invalidNameEmbed);
			break;
		}
		}
	}
};
