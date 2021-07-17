module.exports = {
	name: 'mute',
	aliases: ['m'],
	level: 'Moderator',
	guildOnly: true,
	args: true,
	usage: ['<@user|user-id> <reason>'],
	description: 'Mute a user on the server.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Mute Command ~~");

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

		const dmEmbed = getEmbed.execute(param, guild, botConfig.warningColor, `You've been ${this.name}d`, `${reason}`);
		const successEmbed = getEmbed.execute(param, moderator, botConfig.infoColor, 'Success', `<@${userID}> has been ${this.name}d.`);
		const noMemberEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, `User Not Found`, `Can't find a user with userID of [${userID}].`);
		const noMessageEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, `Invalid Arguments`, `Please provide \`<reason>\`.`);

		if (!member) {
			return replyChannel.send(noMemberEmbed);
		}
		if (!reason) {
			return replyChannel.send(noMessageEmbed);
		}

		const noPermEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, "Missing Permission", "I don't have `MANAGE_ROLES` permission.");
		const highThanBot = getEmbed.execute(param, moderator, botConfig.warningColor, "Missing Permission", "That user have same or higher role than me.");
		const highThanMod = getEmbed.execute(param, moderator, botConfig.warningColor, "Missing Permission", "That user have same or higher role than you.");
		const noRoleEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, "Role Not Found", "Can't find a role named `mute` or `muted`.");

		const botPerm = message.guild.me.hasPermission("MANAGE_ROLES");
		const botFirstRole = message.guild.me.roles.highest.position;
		const modFirstRole = moderator.roles.highest.position;
		const memberFirstRole = member.roles.highest.position;
		const mutedRole = guild.roles.cache.find(role => role.name.match(/^(muted*)/i));

		if (!botPerm) {
			return replyChannel.send(noPermEmbed);
		}
		if (memberFirstRole >= botFirstRole || guild.ownerID == userID) {
			return replyChannel.send(highThanBot);
		}
		if (memberFirstRole >= modFirstRole) {
			return replyChannel.send(highThanMod);
		}
		if (!mutedRole) {
			return replyChannel.send(noRoleEmbed);
		}

		const userTag = member.user.tag.replace(/[.`*+?^${}()|[\]\\]/g, '\\$&');
		const modTag = moderator.user.tag.replace(/[.`*+?^${}()|[\]\\]/g, '\\$&');
		const logEmbed = getEmbed.execute(param, moderator, botConfig.warningColor, '', `**Action**: ${this.name}\n**Reason**: ${reason}`, '', member);

		const newLog = `serverID:${message.guild.id}[=]**[${moment(Date.now()).format("D MMM YYYY, HH:mm UTC")}]**[=]${userTag} ${this.name}ed by ${modTag} [\`${moderator.id}\`][=]Reason: ${reason}`;

		await member.send(dmEmbed).catch(error => {
			const embed = getEmbed.execute(param, moderator, botConfig.errorColor, "An Error Occured", error.message, '', member);
			replyChannel.send(embed);
		});
		await member.roles.add(mutedRole, reason).catch(error => {
			const embed = getEmbed.execute(param, moderator, botConfig.errorColor, "An Error Occured", error.message, '', member);
			return replyChannel.send(embed);
		});

		if (logs) {
			const getLog = logs.mutes;
			if (!getLog[0]) {
				getLog.shift();
			}
			getLog.push(newLog);
			await logs.update({ mutes: getLog });
		} else {
			await ModLogsDB.create({
				userID: userID,
				warnings: [],
				mutes: [newLog],
				kicks: [],
				bans: []
			});
		}
		if (serverConfig.modLogCh) {
			const modLogCh = guild.channels.cache.get(serverConfig.modLogCh);
			if (modLogCh) await modLogCh.send(logEmbed);
		}
		return replyChannel.send(successEmbed);
	}
};
