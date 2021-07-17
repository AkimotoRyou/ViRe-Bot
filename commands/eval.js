module.exports = {
	name: 'eval',
	aliases: ['e'],
	level: 'Owner',
	guildOnly: false,
	args: true,
	usage: ['<code>'],
	description: 'Evaluate a code.',
	note: false,
	async execute(param, message, args, replyChannel) {
		console.log("\n~~ Eval Command ~~");

		function clean(text) {
			if (typeof (text) === "string") {
				return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
			} else {
				return text;
			}
		}

		const code = args.join(' ');
		let evaled = eval(code);

		if (typeof evaled !== 'string') {
			evaled = require('util').inspect(evaled);
		}

		replyChannel.send(clean(evaled), { code: 'xl' });
	}
};
