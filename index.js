require('dotenv').config()
const Discord = require('discord.js')
const fs = require('fs')
const {prefix} = require('./config.json')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for(const file of commandFiles){
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.on('ready', () => {
  client.user.setActivity('GitHub.com', {type: "WATCHING"})
})

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, (...args) => eventHandler(client, ...args))
  })
})


client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase()

    if(!client.commands.has(command)) return;

    try{
      client.commands.get(command).execute(message, args)
    } catch (error){
      console.error(error)
      message.reply('there was an error while trying to execute that command.')
    }
})


client.login(process.env.BOT_TOKEN)
require('http').createServer().listen()
