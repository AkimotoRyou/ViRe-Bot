module.exports = {
	name: 'modlog',
	aliases: ['ml'],
	level: 'Moderator',
	guildOnly: true,
	args: true,
	usage: ['<@user|user-id> [all|warn|kick|mute|ban]'],
	description: 'Show user moderation logs in this guild.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Mod Logs Command ~~");

		const ModLogsDB = param.ModLogsDB;
		const botConfig = param.botConfig;
		const getEmbed = param.getEmbed;
		let userID = args.shift();
		const operation = args.shift();

		if (userID.startsWith('<@') && userID.endsWith('>')) {
			userID = userID.slice(2, -1);

			if (userID.startsWith('!')) {
				userID = userID.slice(1);
			}
		}

		const moderator = message.author;
		const member = await message.guild.members.fetch(userID);
		const guild = message.guild;
		const logs = await ModLogsDB.findOne({ where: { userID: userID } });

		const noLogEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, `Logs Not Found`, `Can't find a moderation logs with userID of [${userID}].`);

		if (!logs) {
			return replyChannel.send(noLogEmbed);
		} else {
			const warnData = [];
			const muteData = [];
			const kickData = [];
			const banData = [];

			const warnLogs = logs.warnings.filter(arr => arr.startsWith(`serverID:${guild.id}`));
			let warnTemp = [];
			let log;
			for (let i = 0; i < warnLogs.length; i++) {
				log = warnLogs[i].split('[=]').splice(1);
				warnTemp.push(`${i + 1}. ${log.join('\n')}`);
				if ((i + 1) % 10 == 0 || i == warnLogs.length - 1) {
					warnData.push(warnTemp);
					warnTemp = [];
				}
			}

			const muteLogs = logs.mutes.filter(arr => arr.startsWith(`serverID:${guild.id}`));
			let muteTemp = [];
			for (let i = 0; i < muteLogs.length; i++) {
				log = muteLogs[i].split('[=]').splice(1);
				muteTemp.push(`${i + 1}. ${log.join('\n')}`);
				if ((i + 1) % 10 == 0 || i == muteLogs.length - 1) {
					muteData.push(muteTemp);
					muteTemp = [];
				}
			}

			const kickLogs = logs.kicks.filter(arr => arr.startsWith(`serverID:${guild.id}`));
			let kickTemp = [];
			for (let i = 0; i < kickLogs.length; i++) {
				log = kickLogs[i].split('[=]').splice(1);
				kickTemp.push(`${i + 1}. ${log.join('\n')}`);
				if ((i + 1) % 10 == 0 || i == kickLogs.length - 1) {
					kickData.push(kickTemp);
					kickTemp = [];
				}
			}

			const banLogs = logs.bans.filter(arr => arr.startsWith(`serverID:${guild.id}`));
			let banTemp = [];
			for (let i = 0; i < banLogs.length; i++) {
				log = banLogs[i].split('[=]').splice(1);
				banTemp.push(`${i + 1}. ${log.join('\n')}`);
				if ((i + 1) % 10 == 0 || i == kickLogs.length - 1) {
					banData.push(banTemp);
					banTemp = [];
				}
			}

			let logEmbed
			switch (operation) {
			case "warn" : {
				for (let i = 0; i < warnData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', warnData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				break;
			}
			case "mute" : {
				for (let i = 0; i < muteData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', muteData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				break;
			}
			case "kick" : {
				for (let i = 0; i < kickData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', kickData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				break;
			}
			case "ban" : {
				for (let i = 0; i < banData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', banData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				break;
			}
			default : {
				for (let i = 0; i < warnData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', warnData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				for (let i = 0; i < muteData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', muteData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				for (let i = 0; i < kickData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', kickData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				for (let i = 0; i < banData.length; i++) {
					logEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, '', banData[i], '', member);
					await replyChannel.send(logEmbed);
				}
				break;
			}
			}
		}
	}
};
