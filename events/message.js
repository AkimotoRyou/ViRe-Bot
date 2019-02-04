const {prefix} = require('../config.json')
const kick = require('../commands/kick')
const ban = require('../commands/ban')
const info = require('../commands/info')
const prune = require('../commands/prune')

module.exports = (client, message) => {
  if(!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase()

  if(command === 'kick'){
    return kick(message)
  }else if(command === 'ban'){
    return ban(message)
  }else if(command === 'info'){
    return info(message)
  }else if(command === 'prune'){
    return prune(args)
  }
}
