module.exports = {
	name: 'ping',
	aliases: false,
	level: 'User',
	guildOnly: false,
	args: false,
	usage: false,
	description: 'Calculate bot latency.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Ping Command ~~");

		const botConfig = param.botConfig;
		const getEmbed = param.getEmbed;
		const author = message.author;

		const pingEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Pong", "Ping?");

		replyChannel.send(pingEmbed).then((msg) => {
			const response = msg.createdTimestamp - message.createdTimestamp;
			const latency = Math.round(param.client.ws.ping);
			const editEmbed = getEmbed.execute(param, author, botConfig.infoColor, "Pong", `**Response time** : **${response}** ms\n**API latency** : **${latency}** ms`);
			msg.edit(editEmbed);
			console.log(`> Response time: ${response} ms. API Latency: ${latency} ms.`)
		});
	}
};
