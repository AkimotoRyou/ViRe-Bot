const {prefix} = require('../config.json')
const kick = require('../commands/kick')
const ban = require('../commands/ban')
const info = require('../commands/info')

module.exports = (client, message) => {
  if(message.content.startsWith(`${prefix}kick`)){
    return kick(message)
  }else if(message.content.startsWith(`${prefix}ban`)){
    return ban(message)
  }else if(message.content(`${prefix}info`)){
    return info(message)
  }
}
