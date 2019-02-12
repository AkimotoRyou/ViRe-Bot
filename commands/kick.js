const Discord = require('discord.js')
module.exports = {
  name : 'kick',
  guildOnly : true,
  execute(message, args) {
    var embedColor = '#ff0000'
    const member = message.mentions.members.first()
//for user without permission
    var missingPermissionEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatar.URL)
      .setTitle('Insufficient Permissions!')
      .setDescription('You need the `.kick_members` permission to use this command!')
      .setTimestamp();
//wrong syntax
    var missingArgsEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle('Missing Arguments!')
      .setDescription('Usage : `kick [@User] [Reason]`')
      .setTimestamp();
    var higherRoleEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`Can't Kick User!`)
      .setDescription('This user have higher role than me.')
      .setTimestamp();
    if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(missingPermissionEmbed);
    let mentioned = message.mentions.users.first();
    if(!mentioned) return message.channel.send(missingArgsEmbed);
    let reason = args.slice(1).join(' ')
    if(!reason) return message.channel.send(missingArgsEmbed);
    if(!member.kickable) return message.channel.send(higherRoleEmbed);

    var kickEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle(`You've been kicked from ${message.guild.name}`)
      .addField('Kicked by ', message.author.tag)
      .addField('Reason ', reason)
      .setTimestamp();
    mentioned.send(kickEmbed);
    var warnSuccessfulEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setTitle(`${member.user.tag} has been kicked.`);
    return member
      .kick()
      .then(() => message.channel.send(warnSuccessfulEmbed))
      .catch(error => message.reply(`Sorry, an error occured.`))
  },
}
