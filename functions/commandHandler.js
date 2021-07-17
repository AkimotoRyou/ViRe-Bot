module.exports = {
	name: "commandHandler",
	async execute(param, message, msgArgs, command) {
		console.log("\n~~ Command Handler ~~");

		const getEmbed = param.getEmbed;
		const botConfig = param.botConfig;
		const serverConfig = param.serverConfig;
		const author = message.author;

		let replyChannel;
		if(message.guild && serverConfig.botChannels.includes(message.channel.id) || !serverConfig.botChannels[0]) {
			replyChannel = message.channel;
		} else {
			replyChannel = message.author;
		}
		console.log(serverConfig.botChannels.length);
		console.log(!serverConfig.botChannels[0]);

		const noPermEmbed = getEmbed.execute(param, author, botConfig.warningColor, "Missing Permission", "You don't have permission to run this command.");

		const isOwner = message.author.id == botConfig.ownerID;
		let isAdmin = false;
		if(message.guild) {
			isAdmin = message.member.hasPermission("ADMINISTRATOR");
		}
		let isModerator = false;
		if(serverConfig.modRoles.length != 0 && message.guild) {
			isModerator = serverConfig.modRoles.some(roleID => message.member.roles.cache.get(roleID));
		}

		switch(command.level) {
		case 'Owner' : {
			if (!botConfig.ownerID) {
				const noIDembed = getEmbed.execute(param, author, botConfig.warningColor, "Not Found", "**OwnerID** value is empty");
				replyChannel.send(noIDembed);
				break;
			} else if (isOwner) {
				await command.execute(param, message, msgArgs, replyChannel);
				break;
			} else {
				replyChannel.send(noPermEmbed);
				break;
			}
		}
		case 'Admin' : {
			if (isOwner || isAdmin) {
				await command.execute(param, message, msgArgs, replyChannel);
				break;
			} else {
				replyChannel.send(noPermEmbed);
				break;
			}
		}
		case 'Moderator' : {
			if (isOwner || isAdmin || isModerator) {
				await command.execute(param, message, msgArgs, replyChannel);
				break;
			} else {
				replyChannel.send(noPermEmbed);
				break;
			}
		}
		default : {
			await command.execute(param, message, msgArgs, replyChannel);
			break;
		}
		}
	}
};
