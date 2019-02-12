const Discord = require('discord.js')
module.exports = {
  name : 'prune',
  execute(message,args) {
    var embedColor = '#ff0000'
    const amount = parseInt(args[0])+1
//for user without permission
    var missingPermissionEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatar.URL)
      .setTitle('Insufficient Permissions!')
      .setDescription('You need the `.manage_messages` permission to use this command!')
      .setTimestamp();
//wrong syntax
    var notNumberEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setTitle('Wrong Syntax!')
      .setDescription('That doesn\'t seem to be a valid number.\nUsage : `prune [amount]`')
      .setTimestamp();
    var beyondNumberEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setTitle('Number Exceed Limit!')
      .setDescription('Input a number between 1 and 100.\nUsage : `prune [amount]`')
      .setTimestamp();
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionEmbed);

    if(isNaN(amount)){
      return message.channel.send(notNumberEmbed)
    } else if(amount <= 1 || amount > 100){
      return message.reply(beyondNumberEmbed)
    }

    var errorEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setTitle('An Error Occured!')
      .setDescription('There was an error when trying to prune messages.')
      .setTimestamp();
    message.channel.bulkDelete(amount).catch(err => {
        console.console.error(err);
        message.channel.send(errorEmbed)
    })
  },
}
