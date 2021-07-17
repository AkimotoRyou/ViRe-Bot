module.exports = {
	event: 'guildMemberAdd',
	once: true,
	async execute(param, ...args) {
		console.log("\n~~ NEW MEMBER ~~");

		const member = args[0];
		const botRole = await member.guild.roles.cache.find(role => role.name.match(/^(bots*)/i));
		const guestRole = await member.guild.roles.cache.find(role => role.name.match(/^(guests*)/i));

		console.log(`> User ${member.user.tag} joined the server.`);

		if (member.user.bot && botRole) {
			member.roles.add(botRole);
			console.log(`> Added ${botRole.name} role to the user.`);
		} else if(!member.user.bot && guestRole) {
			member.roles.add(guestRole);
			console.log(`> Added ${guestRole.name} role to the user.`);
		}
	}
}