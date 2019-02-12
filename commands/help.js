const Discord = require('discord.js')
module.exports = {
  name : 'help',
  execute(message, args){
    var embedColor = '#ffffff'

    var helpEmbed = new Discord.RichEmbed()
      .setColor(embedColor)
      .setAuthor(message.author.username, message.author.avatar.URL)
      .setTitle('Commands list')
      .setDescription("**Prefix : v[space]**\n\n" +
      "**Help : **show this information.\n"+
      "**Info : **giving clan information.\n"+
      "**Warn : **warn a member.\n"+
      "**Kick : **kick a member.\n"+
      "**Ban : **ban a member.\n"+
      "**Prune : **delete up to 100 messages at once.");
    message.channel.send(helpEmbed);
  },
}
