module.exports = {
	name: 'warn',
	aliases: ['w'],
	level: 'Moderator',
	guildOnly: true,
	args: true,
	usage: ['<@user|user-id> <warning-message>'],
	description: 'Warn a user.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Warn Command ~~");

		const ModLogsDB = param.ModLogsDB;
		const botConfig = param.botConfig;
		const serverConfig = param.serverConfig;
		const getEmbed = param.getEmbed;
		const moment = param.moment;
		let userID = args.shift();
		const reason = args.join(' ');

		if (userID.startsWith('<@') && userID.endsWith('>')) {
			userID = userID.slice(2, -1);

			if (userID.startsWith('!')) {
				userID = userID.slice(1);
			}
		}

		const moderator = message.member;
		const member = await message.guild.members.fetch(userID);
		const guild = message.guild;
		const logs = await ModLogsDB.findOne({ where: { userID: userID } });

		const dmEmbed = getEmbed.execute(param, guild, botConfig.warningColor, `You've been ${this.name}ed`, `${reason}`);
		const successEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, 'Success', `<@${userID}> has been ${this.name}ed.`);
		const noMemberEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, `User Not Found`, `Can't find a user with userID of [${userID}].`);
		const noMessageEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, `Invalid Arguments`, `Please provide \`<warning-message>\`.`);
		const noDmEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, 'Not Sent', `<@${userID}> DM is disabled, can't send ${this.name}ing message. ${this.name}ing logged.`);

		if (!member) {
			return replyChannel.send(noMemberEmbed);
		}
		if (!reason) {
			return replyChannel.send(noMessageEmbed);
		}

		const highThanBot = getEmbed.execute(param, moderator, botConfig.warningColor, "Missing Permission", "That user have same or higher role than me.");
		const highThanMod = getEmbed.execute(param, moderator, botConfig.warningColor, "Missing Permission", "That user have same or higher role than you.");

		const botFirstRole = message.guild.me.roles.highest.position;
		const modFirstRole = moderator.roles.highest.position;
		const memberFirstRole = member.roles.highest.position;

		if (memberFirstRole >= botFirstRole || guild.ownerID == userID) {
			return replyChannel.send(highThanBot);
		}
		if (memberFirstRole >= modFirstRole) {
			return replyChannel.send(highThanMod);
		}

		const userTag = member.user.tag.replace(/[.`*+?^${}()|[\]\\]/g, '\\$&');
		const modTag = moderator.user.tag.replace(/[.`*+?^${}()|[\]\\]/g, '\\$&');
		const logEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, '', `**Action**: ${this.name}\n**Reason**: ${reason}`, '', member);

		const newLog = `serverID:${message.guild.id}[=]**[${moment(Date.now()).format("D MMM YYYY, HH:mm UTC")}]**[=]${userTag} ${this.name}ed by ${modTag} [\`${moderator.id}\`][=]Reason: ${reason}`;

		if (logs) {
			const getLog = logs.warnings;
			if (!getLog[0]) {
				getLog.shift();
			}
			getLog.push(newLog);
			await logs.update({ warnings: getLog });
		} else {
			await ModLogsDB.create({
				userID: userID,
				warnings: [newLog],
				mutes: [],
				kicks: [],
				bans: []
			});
		}
		if (serverConfig.modLogCh) {
			const modLogCh = guild.channels.cache.get(serverConfig.modLogCh);
			if (modLogCh) await modLogCh.send(logEmbed);
		}
		try{
			await member.send(dmEmbed);
		} catch (error) {
			if(error.message == "Cannot send messages to this user") {
				return replyChannel.send(noDmEmbed);
			}
		}

		return replyChannel.send(successEmbed);
	}
};
