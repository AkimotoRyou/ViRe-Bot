module.exports = {
	name: 'setserver',
	aliases: ['ss'],
	level: 'Admin',
	guildOnly: true,
	args: true,
	usage: ['<config-name> [add|del|+|-] <config-value>', 'reset [all|config-name]'],
	description: 'Set server configuration.',
	note: `- <config-name> value is case sensitive.\n- [add|del|+|-] operation is only for config that have multiple value (ex. modRoles, botChannels, blacklist).`,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Setserver Command ~~");

		const serverConfigSync = param.serverConfigSync;
		const ServerConfigsDB = param.ServerConfigsDB;
		const botConfig = param.botConfig;
		const serverConfig = param.serverConfigColl.default;
		const serverConfigKeys = Object.keys(serverConfig).map(key => `\`${key}\``).join(', ');
		const guildID = message.guild.id;
		const serverDB = await ServerConfigsDB.findOne({ where: { serverID: guildID } });
		const getEmbed = param.getEmbed;
		const author = message.author;

		const configName = args.shift();
		let configValue = args.shift();

		const constantEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Constant Value", `This value can't be changed.`);
		const noConfigEmbed = getEmbed.execute(param, author, botConfig.errorColor, "Not Found", `Can't find this server configs in database, resetting the server configs. Please try again later.`)
		const invalidNameEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Name", `Can't find config named ${configName}.`, [`Available names;${serverConfigKeys}`]);
		const notNumberEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Not a Number", `The value must be a number.`);
		const duplicatedEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Duplicated", `Same value already in the Database.`);
		const emptyValueEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Empty Value", "The value can't be empty for this config.");
		const invalidRoleEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Not Found", `Can't find a role with ID of \`[${args[0]}]\` in this server.`);
		const invalidChannelEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Not Found", `Can't find a channel with ID of \`[${args[0]}]\` in this server.`);
		const invalidValueEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Value", `Can't find the value in database.`);

		if (!serverDB) {
			await param.serverConfigReset.execute(param, message.guild.id).then(() => {
				return replyChannel.send(noConfigEmbed);
			});
		} else {
			switch(configName) {
			case 'serverID' : {
				console.log("> serverID");

				replyChannel.send(constantEmbed);
				break;
			}
			case 'prefix' : {
				console.log("> prefix");

				if (!configValue) {
					console.log("> empty value");

					replyChannel.send(emptyValueEmbed);
					break;
				} else {
					console.log(`> Updating ${configName} from ${serverDB.prefix} to ${configValue}`);

					const updated = await serverDB.update({ prefix: configValue }).then(console.log("> Updated"));
					const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${configName} to ${updated[configName]}.`);
					await serverConfigSync.execute(param).then(() => {
						replyChannel.send(updatedEmbed);
					});
					break;
				}
			}
			case 'cooldown' : {
				console.log("> cooldown");

				if (!configValue || configValue < 0) {
					configValue = "0";
				} else if (isNaN(configValue)) {
					replyChannel.send(notNumberEmbed);
					break;
				}
				const updated = await serverDB.update({ cooldown: configValue });
				const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${configName} to ${updated[configName]}.`);
				await serverConfigSync.execute(param).then(() => {
					replyChannel.send(updatedEmbed);
				});
				break;
			}
			case 'modLogCh' : {
				console.log("> modLogCh");

				if (!configValue) {
					console.log("> empty value");
					console.log(`> Updating ${configName} from ${serverDB.modLogCh} to ${configValue}`);

					const updated = await serverDB.update({ modLogCh: configValue }).then(console.log("> Updated"));
					const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${configName} to ${updated[configName]}.`);
					await serverConfigSync.execute(param).then(() => {
						replyChannel.send(updatedEmbed);
					});
					break;
				} else {
					const search = message.guild.channels.cache.get(configValue);
					if (!search) {
						replyChannel.send(invalidChannelEmbed);
						break;
					} else {
						console.log(`> Updating ${configName} from ${serverDB.modLogCh} to ${configValue}`);

						const updated = await serverDB.update({ modLogCh: configValue }).then(console.log("> Updated"));
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${configName} to ${updated[configName]}.`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				}
			}
			case 'entryLogCh' : {
				console.log("> entryLogCh");

				if (!configValue) {
					console.log("> empty value");
					console.log(`> Updating ${configName} from ${serverDB.entryLogCh} to ${configValue}`);

					const updated = await serverDB.update({ entryLogCh: configValue }).then(console.log("> Updated"));
					const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${configName} to ${updated[configName]}.`);
					await serverConfigSync.execute(param).then(() => {
						replyChannel.send(updatedEmbed);
					});
					break;
				} else {
					const search = message.guild.channels.cache.get(configValue);
					if (!search) {
						replyChannel.send(invalidChannelEmbed);
						break;
					} else {
						console.log(`> Updating ${configName} from ${serverDB.entryLogCh} to ${configValue}`);

						const updated = await serverDB.update({ entryLogCh: configValue }).then(console.log("> Updated"));
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Changed the value of ${configName} to ${updated[configName]}.`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				}
			}
			case 'modRoles' : {
				console.log("> modRoles");

				const operator = configValue;
				configValue = args.shift();
				const roles = serverDB.modRoles;
				const index = roles.indexOf(configValue);
				if (!configValue) {
					replyChannel.send(emptyValueEmbed);
					break;
				} else if (operator == "add" || operator == "+") {
					const search = message.guild.roles.cache.get(configValue);
					if (index >= 0) {
						replyChannel.send(duplicatedEmbed);
						break;
					} else if (!search) {
						replyChannel.send(invalidRoleEmbed);
						break;
					} else {
						if (!roles[0]) {
							roles.shift();
						}
						roles.push(configValue);
						await serverDB.update({ modRoles: roles });
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Added ${configValue} to ${configName}.\n${serverDB[configName].map(r => `\`[${r}]\``).join(', ')}`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				} else if (operator == "del" || operator == "-") {
					if (index < 0) {
						replyChannel.send(invalidValueEmbed);
						break;
					} else {
						roles.splice(index, 1);
						await serverDB.update({ modRoles: roles });
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Removed ${configValue} from ${configName}.\n${serverDB[configName].map(r => `\`[${r}]\``).join(', ')}`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				} else {
					const invalidArgsEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Arguments", `Usage : \`${serverConfig.prefix}${this.name} ${configName} [add/del] <config-value>\``);
					replyChannel.send(invalidArgsEmbed);
					break;
				}
			}
			case 'botChannels' : {
				console.log("> botChannels");

				const operator = configValue;
				configValue = args.shift();
				const channels = serverDB.botChannels;
				const index = channels.indexOf(configValue);
				if (!configValue) {
					replyChannel.send(emptyValueEmbed);
					break;
				} else if (operator == "add" || operator == "+") {
					const search = message.guild.channels.cache.get(configValue);
					if (index >= 0) {
						replyChannel.send(duplicatedEmbed);
						break;
					} else if (!search) {
						replyChannel.send(invalidChannelEmbed);
						break;
					} else {
						if (!channels[0]) {
							channels.shift();
						}
						channels.push(configValue);
						await serverDB.update({ botChannels: channels });
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Added ${configValue} to ${configName}.\n${serverDB[configName].map(r => `\`[${r}]\``).join(', ')}`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				} else if (operator == "del" || operator == "-") {
					if (index < 0) {
						replyChannel.send(invalidValueEmbed);
						break;
					} else {
						channels.splice(index, 1);
						await serverDB.update({ botChannels: channels });
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Removed ${configValue} from ${configName}.\n${serverDB[configName].map(r => `\`[${r}]\``).join(', ')}`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				} else {
					const invalidArgsEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Arguments", `Usage : \`${serverConfig.prefix}${this.name} ${configName} [add/del] <config-value>\``);
					replyChannel.send(invalidArgsEmbed);
					break;
				}
			}
			case 'blacklist' : {
				console.log("> blacklist");

				const operator = configValue;
				configValue = args.shift();
				const blacklist = serverDB.blacklist;
				const index = blacklist.indexOf(configValue);
				if (!configValue) {
					replyChannel.send(emptyValueEmbed);
					break;
				} else if (operator == "add" || operator == "+") {
					if (index >= 0) {
						replyChannel.send(duplicatedEmbed);
						break;
					} else {
						if (!blacklist[0]) {
							blacklist.shift();
						}
						blacklist.push(configValue);
						await serverDB.update({ blacklist: blacklist });
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Added ${configValue} to ${configName}.\n${serverDB[configName].map(r => `\`[${r}]\``).join(', ')}`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				} else if (operator == "del" || operator == "-") {
					if (index < 0) {
						replyChannel.send(invalidValueEmbed);
						break;
					} else {
						blacklist.splice(index, 1);
						await serverDB.update({ blacklist: blacklist });
						const updatedEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Success", `Removed ${configValue} from ${configName}.\n${serverDB[configName].map(r => `\`[${r}]\``).join(', ')}`);
						await serverConfigSync.execute(param).then(() => {
							replyChannel.send(updatedEmbed);
						});
						break;
					}
				} else {
					const invalidArgsEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Invalid Arguments", `Usage : \`${serverConfig.prefix}${this.name} ${configName} [add/del] <config-value>\``);
					replyChannel.send(invalidArgsEmbed);
					break;
				}
			}
			case 'reset' : {
				let resetName = configValue;
				if (!resetName) {
					resetName = "all";
				} else if (!serverConfigKeys.includes(`\`${resetName}\``)) {
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
							await param.serverConfigReset.execute(param, guildID, resetName).then(() => {
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
				console.log("> default");
				replyChannel.send(invalidNameEmbed);
				break;
			}
			}
		}
	}
};
