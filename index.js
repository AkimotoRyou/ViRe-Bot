require('dotenv').config();
const Discord = require('discord.js');
const { Util, MessageAttachment } = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');
const moment = require("moment");
const defaultConfig = require('./config.json');
const Sequelize = require("sequelize");
const keepAlive = require("./server.js");

// #database

const botConfigDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "botConfig.sqlite"
});
const BotConfigDB = botConfigDB.define("botConfig", {
	name: {
		type: Sequelize.STRING,
		unique: true
	},
	value: Sequelize.STRING
});

const serverConfigsDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "serverConfigs.sqlite"
});
const ServerConfigsDB = serverConfigsDB.define("serverConfig", {
	serverID: {
		type: Sequelize.STRING,
		unique: true
	},
	prefix: Sequelize.STRING,
	cooldown: Sequelize.STRING,
	modLogCh: Sequelize.STRING,
	entryLogCh: Sequelize.STRING,
	modRoles: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('modRoles').split(';')
		},
		set(val) {
			this.setDataValue('modRoles', val.join(';'));
		},
	},
	botChannels: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('botChannels').split(';')
		},
		set(val) {
			this.setDataValue('botChannels', val.join(';'));
		},
	},
	blacklist: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('blacklist').split(';')
		},
		set(val) {
			this.setDataValue('blacklist', val.join(';'));
		},
	}
});

const modLogsDB = new Sequelize("database", "user", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "modLogs.sqlite"
});
const ModLogsDB = modLogsDB.define("modLogs", {
	userID: {
		type: Sequelize.STRING,
		unique: true
	},
	warnings: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('warnings').split(';')
		},
		set(val) {
			this.setDataValue('warnings', val.join(';'));
		},
	},
	mutes: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('mutes').split(';')
		},
		set(val) {
			this.setDataValue('mutes', val.join(';'));
		},
	},
	kicks: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('kicks').split(';')
		},
		set(val) {
			this.setDataValue('kicks', val.join(';'));
		},
	},
	bans: {
		type: Sequelize.STRING,
		allowNull: false,
		get() {
			return this.getDataValue('bans').split(';')
		},
		set(val) {
			this.setDataValue('bans', val.join(';'));
		},
	},

});

// #commandsCollection
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const cmd = require(`./commands/${file}`);
	client.commands.set(cmd.name, cmd);
}

// #functionsCollection
client.functions = new Discord.Collection();
const functionFiles = fs.readdirSync('./functions').filter(file => file.endsWith('.js'));
for (const file of functionFiles) {
	const func = require(`./functions/${file}`);
	client.functions.set(func.name, func);
}

// #cooldownsCollection
client.cooldowns = new Discord.Collection();

// #ConfigTemplate (Will be synced with Database later)
const botConfig = {
	ownerID: "",
	maintenance: "",
	infoColor: "",
	warningColor: "",
	errorColor: ""
}

const serverConfigColl = {
	default: {
		serverID: "default",
		prefix: defaultConfig.prefix,
		cooldown: defaultConfig.cooldown,
		modLogCh : defaultConfig.modLogCh,
		entryLogCh : defaultConfig.entryLogCh,
		modRoles: defaultConfig.modRoles,
		botChannels: defaultConfig.botChannels,
		blacklist: defaultConfig.blacklist
	}
}

const param = {
	Discord: Discord,
	MessageAttachment: MessageAttachment,
	client: client,
	fs: fs,
	BotConfigDB: BotConfigDB,
	ServerConfigsDB: ServerConfigsDB,
	ModLogsDB: ModLogsDB,
	defaultConfig: defaultConfig,
	botConfig: botConfig,
	serverConfig: serverConfigColl["default"],
	serverConfigColl: serverConfigColl
}

client.functions.forEach(fn => param[fn.name] = client.functions.get(fn.name));

fs.readdir('./events/', (err, files) => {
	if(err) return console.log(err);
	files.forEach(file => {
		const eventFunction = require(`./events/${file}`);
		if(eventFunction.disabled) return;

		const event = eventFunction.event || file.split('.')[0];
		const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
		const once = eventFunction.once;

		try {
			emitter[once ? 'once' : 'on'](event, async (...args) => await eventFunction.execute(param, ...args));
		} catch (error) {
			console.log(error.stack);
		}
	});
});

keepAlive();
client.login(process.env.TOKEN);
require("https").createServer().listen();