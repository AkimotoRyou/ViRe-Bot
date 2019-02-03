require('dotenv').config()
const {prefix} = require('./config.json')
const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity('https://github.com/AkimotoRyou/ViRe-Bot', {type: "WATCHING"})
})

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, (...args) => eventHandler(client, ...args))
  })
})

client.login(process.env.BOT_TOKEN)
require('http').createServer().listen(3000)
