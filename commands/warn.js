const Discord = require('discord.js')
module.exports = {
  name : 'warn',
  execute(message, args){
    var embedColor = '#ff0000'
    const member = message.mentions.members.first()
//for user without permission
    var missingPermissionEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatar.URL)
      .setTitle('Insufficient Permissions!')
      .setDescription('You need the `.manage_messages` permission to use this command!')
      .setTimestamp();
//wrong syntax
    var missingArgsEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle('Missing Arguments!')
      .setDescription('Usage : `warn [@User] [Reason]`')
      .setTimestamp();
    if(!message.member.hasPermission('MANNAGE_MESSAGES')) return message.channel.send(missingPermissionEmbed);
    let mentioned = message.mentions.users.first();
    if(!mentioned) return message.channel.send(missingArgsEmbed);
    let reason = args.slice(1).join(' ')
    if(!reason) return message.channel.send(missingArgsEmbed);

    var warningEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`You've been warned in ${message.guild.name}`)
      .addField('Warned by ', message.author.tag)
      .addField('Reason ', reason)
      .setTimestamp();
    mentioned.send(warningEmbed);
    var warnSuccessfulEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setTitle(`${member.user.tag} has been warned.`);
    message.channel.send(warnSuccessfulEmbed);
    message.delete();
  },
}
