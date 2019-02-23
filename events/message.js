const Discord = require('discord.js')
const fs = require('fs')
const {prefix, blacklist} = require('../config.json')

module.exports = (client, message) => {

  client.commands = new Discord.Collection()

  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

  for(const file of commandFiles){
    const command = require(`../commands/${file}`)
    client.commands.set(command.name, command)
  }

  if(message.author.bot) return;
  var args,command
  var censor = "[Censored]";
//Filter features
  if(!message.content.startsWith(prefix[0]) || !message.content.startsWith(prefix[1]) || !message.isMentioned(client.user)){
    var edit = message.content;
    for (var i=0; i<= blacklist.length; i++) {
      if (message.content.toLowerCase().includes(blacklist[i])) {
        edit = edit.replace(new RegExp(blacklist[i], 'gi'), censor)
      }
    }
    if(edit != message.content){
      message.delete()
      message.channel.send(`${message.author.username} : ${edit}`)
    }
  }
//Commands Handler
  if(message.content.startsWith(prefix[0]) || message.content.startsWith(prefix[1])){
      args = message.content.slice(prefix.length).split(/ +/)
      command = args.shift().toLowerCase()
  } else if (message.isMentioned(client.user)){
      args = message.content.slice(22).split(/ +/)
      command = args.shift().toLowerCase()
  }
  if(!client.commands.has(command)) return;
  try{
    client.commands.get(command).execute(message, args)
  } catch (error){
    console.error(error)
    message.reply('there was an error while trying to execute that command.')
  }
}
