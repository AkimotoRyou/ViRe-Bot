console.log('Loading Dependencies')
require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const {prefix, blacklist} = require('./config.json')

console.log('Loading Embed Colors')
var information = '#add8e6'
var warning = '#ffff00'
var success = '#ff0000'
var error = '#ff0000'

client.on('ready', () => {
  client.user.setActivity('GitHub.com | v help', {type: "WATCHING"})
  //client.user.setActivity('Test Version', {type: "PLAYING"})
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', (member) => {
  if(member.user.bot){
    member.addRole(member.guild.roles.find(role => role.name === 'Bots').id).catch(console.error)
  } else {
    member.addRole(member.guild.roles.find(role => role.name === 'Guest').id).catch(console.error)
    member.send('Welcome to VictoriousReturn server!\n Please follow the rules at #rules channel to make a nice environment for all of us :)\n\nRegards, \n\nDiscord Admin')}
})

client.on('message', (message) => {
  if(message.author.bot) return;
  client.emit('checkMessage', message);
  var args,command
  var censor = "[Censored]";
  tempPrefix = message.content.split(" ", 1).join(" ").toLowerCase();

//Filter features
  var edit = message.content;
  for (var i=0; i<= blacklist.length; i++) {
    if (message.content.toLowerCase().includes(blacklist[i])) {
      edit = edit.replace(new RegExp(blacklist[i], 'gi'), censor)
    }
  }
  if(edit !== message.content){
    message.delete()
    message.channel.send(`${message.author.username} : ${edit}`)
    console.log(`Message by ${message.author.username} has been filtered`)
  } else {
    //Commands Handler
      if(tempPrefix === prefix || message.isMentioned(client.user)){
        command = message.content.toLowerCase().split(" ", 2).slice(1).join("")
        args = message.content.split(" ").slice(2).join(" ")
        try{
          if(command === 'help'){
            //Help Command
              var Embed = new Discord.RichEmbed()
                .setColor(information)
                .setTitle('Commands list')
                .setDescription("**Prefix : v[space]**\n\n" +
                "**Help : **show this information.\n"+
                "**Guild : **giving clan information.\n"+
                "**Warn : **warn a member.\n"+
                "**Kick : **kick a member.\n"+
                "**Ban : **ban a member.\n"+
                "**Prune : **delete up to 100 messages at once.")
                .setFooter(`${client.user.tag} by Asterisk*#6944`)
                .setTimestamp();
              message.channel.send(Embed);
          } else if(command === 'guild'){
            //Guild Commands
              var Embed = new Discord.RichEmbed()
                .setColor(information)
                .setTitle(`${message.guild.name}`)
                .setDescription("**Clan Media**\n"+
                "Discord  : <http://discord.gg/meu46Vt>\n"+
                "Guilded  : <http://guilded.gg/ViRe>\n"+
                "Facebook : <http://www.facebook.com/VictoriousReturn/?ref=br_rs>\n"+
                "YouTube  : <http://m.youtube.com/channel/UCz6h1Xcj3zZ2Oq8sSoirppQ>\n")
                .setFooter(`${client.user.tag} by Asterisk*#6944`)
                .setTimestamp();
              message.channel.send(Embed);
          } else if(command === 'warn'){
            const member = message.mentions.members.first()
            //for user without permission
              var missingPermissionEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatar.URL)
                .setTitle('Insufficient Permissions!')
                .setDescription('You need the `manage_messages` permission to use this command!')
                .setTimestamp();
            //wrong syntax
              var missingArgsEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle('Missing Arguments!')
                .setDescription('Usage : `warn [@User] [Reason]`')
                .setTimestamp();
              if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionEmbed);
              let mentioned = message.mentions.users.first();
              if(!mentioned) return message.channel.send(missingArgsEmbed);
              let reason = args.split(" ").slice(1).join(' ')
              if(!reason) return message.channel.send(missingArgsEmbed);
              var warningEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`You've been warned in ${message.guild.name}`)
                .addField('Warned by ', message.author.tag)
                .addField('Reason ', reason)
                .setTimestamp();
              mentioned.send(warningEmbed).catch(error => message.channel.send(`Cannot send warning to ${member.user.tag}`));
              var warnSuccessfulEmbed = new Discord.RichEmbed()
                .setColor(success)
                .setTitle(`${member.user.tag} has been warned.`)
                .setTimestamp();
              message.channel.send(warnSuccessfulEmbed);
          } else if(command === 'kick'){
              const member = message.mentions.members.first()
            //for user without permission
              var missingPermissionEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatar.URL)
                .setTitle('Insufficient Permissions!')
                .setDescription('You need the `kick_members` permission to use this command!')
                .setTimestamp();
            //wrong syntax
              var missingArgsEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle('Missing Arguments!')
                .setDescription('Usage : `kick [@User] [Reason]`')
                .setTimestamp();
              var higherRoleEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`Can't Kick User!`)
                .setDescription('This user have higher role than me.')
                .setTimestamp();
              if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(missingPermissionEmbed);
              let mentioned = message.mentions.users.first();
              if(!mentioned) return message.channel.send(missingArgsEmbed);
              let reason = args.split(" ").slice(1).join(' ')
              if(!reason) return message.channel.send(missingArgsEmbed);
              if(!member.kickable) return message.channel.send(higherRoleEmbed);
              var kickEmbed = new Discord.RichEmbed()
                .setColor(success)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`You've been kicked from ${message.guild.name}`)
                .addField('Kicked by ', message.author.tag)
                .addField('Reason ', reason)
                .setTimestamp();
              mentioned.send(kickEmbed).catch(error => message.channel.send(`Cannot send kick reason to ${member.user.tag}`));
              var warnSuccessfulEmbed = new Discord.RichEmbed()
                .setColor(success)
                .setTitle(`${member.user.tag} has been kicked.`);
              member.kick().then(() => message.channel.send(warnSuccessfulEmbed)).catch(error => message.reply(`Sorry, an error occured.`))
          } else if(command === 'ban'){
              const member = message.mentions.members.first()
            //for user without permission
              var missingPermissionEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatar.URL)
                .setTitle('Insufficient Permissions!')
                .setDescription('You need the `ban_members` permission to use this command!')
                .setTimestamp();
            //wrong syntax
              var missingArgsEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle('Missing Arguments!')
                .setDescription('Usage : `kick [@User] [Reason]`')
                .setTimestamp();
              var higherRoleEmbed = new Discord.RichEmbed()
                .setColor(warning)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`Can't Ban User!`)
                .setDescription('This user have higher role than me.')
                .setTimestamp();
              if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(missingPermissionEmbed);
              let mentioned = message.mentions.users.first();
              if(!mentioned) return message.channel.send(missingArgsEmbed);
              let reason = args.split(" ").slice(1).join(' ')
              if(!reason) return message.channel.send(missingArgsEmbed);
              if(!member.kickable) return message.channel.send(higherRoleEmbed);
              var banEmbed = new Discord.RichEmbed()
                .setColor(success)
                .setAuthor(message.author.username, message.author.avatarURL)
                .setTitle(`You've been banned from ${message.guild.name}`)
                .addField('Banned by ', message.author.tag)
                .addField('Reason ', reason)
                .setTimestamp();
              mentioned.send(banEmbed).catch(error => message.channel.send(`Cannot send ban reason to ${member.user.tag}`));
              var banSuccessfulEmbed = new Discord.RichEmbed()
                .setColor(embedColor)
                .setTitle(`${member.user.tag} has been banned.`);
              member.kick().then(() => message.channel.send(banSuccessfulEmbed)).catch(error => message.reply(`Sorry, an error occured.`))
          } else if(command === 'prune'){
                const amount = parseInt(args[0])+1
              //for user without permission
                var missingPermissionEmbed = new Discord.RichEmbed()
                  .setColor(warning)
                  .setAuthor(message.author.username, message.author.avatar.URL)
                  .setTitle('Insufficient Permissions!')
                  .setDescription('You need the `.manage_messages` permission to use this command!')
                  .setTimestamp();
              //wrong syntax
                var notNumberEmbed = new Discord.RichEmbed()
                  .setColor(warning)
                  .setTitle('Wrong Syntax!')
                  .setDescription('That doesn\'t seem to be a valid number.\nUsage : `prune [amount]`')
                  .setTimestamp();
                var beyondNumberEmbed = new Discord.RichEmbed()
                  .setColor(warning)
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
                  .setColor(error)
                  .setTitle('An Error Occured!')
                  .setDescription('There was an error when trying to prune messages.')
                  .setTimestamp();
                message.channel.bulkDelete(amount).catch(err => {
                    console.console.error(err);
                    message.channel.send(errorEmbed)
                });
          }
        } catch (error){
          console.error(error)
          message.reply('there was an error while trying to execute that command.')
        }
      }
  }

})

client.login(process.env.BOT_TOKEN)
require('http').createServer().listen()
