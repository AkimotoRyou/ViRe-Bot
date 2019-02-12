const Discord = require('discord.js')
module.exports = {
  name : 'ban',
  guildOnly : true,
  execute(message, args) {
    var embedColor = '#ff0000'
    const member = message.mentions.members.first()
//for user without permission
    var missingPermissionEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatar.URL)
      .setTitle('Insufficient Permissions!')
      .setDescription('You need the `.ban_members` permission to use this command!')
      .setTimestamp();
//wrong syntax
    var missingArgsEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatarURL)
      .setTitle('Missing Arguments!')
      .setDescription('Usage : `ban [@User] [Reason]`')
      .setTimestamp();
      var higherRoleEmbed = new Discord.RichEmbed()
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`Can't Ban User!`)
        .setDescription('This user have higher role than me.')
        .setTimestamp();
      if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(missingPermissionEmbed);
      let mentioned = message.mentions.users.first();
      if(!mentioned) return message.channel.send(missingArgsEmbed);
      let reason = args.slice(1).join(' ')
      if(!reason) return message.channel.send(missingArgsEmbed);
      if(!member.banable) return message.channel.send(higherRoleEmbed);

      var banEmbed = new Discord.RichEmbed()
        .setColor(embedColor)
        .setAuthor(message.author.username, message.author.avatarURL)
        .setTitle(`You've been banned from ${message.guild.name}`)
        .addField('Banned by ', message.author.tag)
        .addField('Reason ', reason)
        .setTimestamp();
      mentioned.send(banEmbed);
      var warnSuccessfulEmbed = new Discord.RichEmbed()
        .setColor(embedColor)
        .setTitle(`${member.user.tag} has been banned.`);
      return member
        .ban()
        .then(() => message.channel.send(warnSuccessfulEmbed))
        .catch(error => message.reply(`Sorry, an error occured.`))
  },
}
