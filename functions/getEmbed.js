module.exports = {
	name: "getEmbed",
	execute(param, author, color, title, description, fields, footer) {
		console.log("\n~~ Get Embed ~~");
		console.log(`> ${title || 'no title'}`);

		const embed = new param.Discord.MessageEmbed().setTimestamp();

		if (author) {
			if (author.name) {
				// author is a guild instance
				embed.setAuthor(author.name, author.iconURL())
			} else if (author.user) {
				// author is a guild member instance
				embed.setAuthor(author.user.tag, author.user.displayAvatarURL());
			} else {
				// author is a user instance
				embed.setAuthor(author.tag, author.displayAvatarURL());
			}
		}
		if (color) {
			embed.setColor(color);
		}
		if (title) {
			embed.setTitle(title);
		}
		if (description) {
			embed.setDescription(description);
		}
		if (fields) {
			fields.forEach(field => {
				const splitted = field.split(';');
				embed.addField(splitted[0], splitted[1]);
			})
		}
		if (footer) {
			if (footer.user) {
				embed.setFooter(`${footer.user.tag} - [${footer.user.id}]`, footer.user.displayAvatarURL());
			} else if (footer.tag) {
				embed.setFooter(`${footer.tag} - [${footer.id}]`, footer.displayAvatarURL());
			} else {
				embed.setFooter(footer);
			}
		}
		return embed;
	}
};
