const fs = require('fs')
const Discord = require('discord.js')
const {prefix} = require('../config.json')

module.exports = (client, message) => {
//Getting commands files at ../commands
  client.commands = new Discord.Collection()
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

  for(const file of commandFiles){
    const command = require(`../commands/${file}`)
    client.commands.set(command.name, command)
  }

//Executing commands
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase()

  if(!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName)

  try{
    client.commands.get(command).execute(message, args)
  } catch (error){
    console.error(error)
    message.repl('there was an error while trying to execute that command.')
  }
}
