require('dotenv').config()
const {prefix} = require('./config.json')
const Discord = require('discord.js')
const fs = require('fs')
const client = new Discord.Client()

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`)
    const eventName = file.split('.')[0]
    client.on(eventName, (...args) => eventHandler(client, ...args))
  })
})

client.login(proceess.env.BOT_TOKEN)
require('http').createServer().listen(3000)
