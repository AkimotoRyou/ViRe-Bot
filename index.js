console.log('Loading Dependencies')
require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const {prefix, blacklist, selfrole} = require('./config.json')

console.log('Loading Embed Colors')
var information = '#add8e6'
var warning = '#ffff00'
var success = '#ff0000'
var error = '#ff0000'

console.log('Loading Functions')
function getEmbed(color, title, description){
  var embed = new Discord.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setFooter(`${client.user.tag} by Asterisk*#6944`)
    .setTimestamp();
  return embed;
}
function getDMEmbed(color, title, field1, field2){
  var temp1 = field1.split(",")
  var temp2 = field2.split(",")
  var embed = new Discord.RichEmbed()
    .setColor(color)
    .setTitle(title)
    .addField(temp1[0], temp1[1])
    .addField(temp2[0], temp2[1])
    .setFooter(`${client.user.tag} by Asterisk*#6944`)
    .setTimestamp();
  return embed;
}

client.on('ready', () => {
  //client.user.setActivity('GitHub.com | v help', {type: "WATCHING"})
  client.user.setActivity('Test Version', {type: "PLAYING"})
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', (member) => {
  if(member.user.bot){
    member.addRole(member.guild.roles.find(role => role.name === 'Bots').id).catch(console.error)
  } else {
    member.addRole(member.guild.roles.find(role => role.name === 'Guest').id).catch(console.error)
    var embed = getEmbed(information, `Welcome to ${member.guild.name} server!`, "Please follow the rules at #rules channel to make a nice environment for all of us :)\n\nRegards, \n\nDiscord Admin")
    member.send(embed)}
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
      if(tempPrefix === prefix || tempPrefix === "<@541413292900352005>"){
        command = message.content.toLowerCase().split(" ", 2).slice(1).join("")
        args = message.content.split(" ").slice(2).join(" ")
        try{
          if(command === 'help'){
              //Help Command
                var embed = getEmbed(information, 'Commands list', "**Prefix : v[space]**\n\n" +
                "**Help : **show this information.\n"+
                "**Guild : **giving clan information.\n"+
                "**Selfrole : **get selfrole list.\n"+
                "**Getrole : **get a role from selfrole list.\n"+
                "**Warn : **warn a member.\n"+
                "**Kick : **kick a member.\n"+
                "**Ban : **ban a member.\n"+
                "**Prune : **delete up to 100 messages at once.");
                message.channel.send(embed);
          } else if(command === 'guild'){
              //Guild Commands
                var embed = getEmbed(information, `${message.guild.name}`, "**Clan Media**\n"+
                "Discord  : <http://discord.gg/meu46Vt>\n"+
                "Guilded  : <http://guilded.gg/ViRe>\n"+
                "Facebook : <http://www.facebook.com/VictoriousReturn/?ref=br_rs>\n"+
                "YouTube  : <http://m.youtube.com/channel/UCz6h1Xcj3zZ2Oq8sSoirppQ>\n");
                message.channel.send(embed);
          } else if(command === 'warn'){
                const member = message.mentions.members.first()
              //for user without permission
                var missingPermissionEmbed = getEmbed(warning, 'Insufficient Permissions!', 'You need the `manage_messages` permission to use this command!');
              //wrong syntax
                var missingArgsEmbed = getEmbed(warning, 'Missing Arguments!', 'Usage : `warn [@User] [Reason]`');
                if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionEmbed);

                let mentioned = message.mentions.users.first();
                if(!mentioned) return message.channel.send(missingArgsEmbed);

                let reason = args.split(" ").slice(1).join(' ')
                if(!reason) return message.channel.send(missingArgsEmbed);

                var warningEmbed = getDMEmbed(warning, `You've been warned in ${message.guild.name}`, `Warned by , ${message.author.tag}`, `Reason , ${reason}`);
                mentioned.send(warningEmbed).catch(error => message.channel.send(`Cannot send warning to ${member.user.tag}`));

                var warnSuccessfulEmbed = getDMEmbed(success, `${member.user.tag} has been warned.`, `Warned by , ${message.author.tag}`, `Reason , ${reason}`)
                message.channel.send(warnSuccessfulEmbed);
          } else if(command === 'kick'){
                const member = message.mentions.members.first()
              //for user without permission
                var missingPermissionEmbed = getEmbed(warning, 'Insufficient Permissions!', 'You need the `kick_members` permission to use this command!')
              //wrong syntax
                var missingArgsEmbed = getEmbed(warning, 'Missing Arguments!', 'Usage : `kick [@User] [Reason]`')
                var higherRoleEmbed = getEmbed(warning, `Can't Kick User!`, 'This user have higher role than me.')
                if(!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send(missingPermissionEmbed);

                let mentioned = message.mentions.users.first();
                if(!mentioned) return message.channel.send(missingArgsEmbed);

                let reason = args.split(" ").slice(1).join(' ')
                if(!reason) return message.channel.send(missingArgsEmbed);
                if(!member.kickable) return message.channel.send(higherRoleEmbed);

                var kickEmbed = getDMEmbed(success, `You've been kicked from ${message.guild.name}`, `Kicked by , ${message.author.tag}`, `Reason , ${reason}`)
                mentioned.send(kickEmbed).catch(error => message.channel.send(`Cannot send kick reason to ${member.user.tag}`));

                var warnSuccessfulEmbed = getDMEmbed(success, `${member.user.tag} has been kicked.`, `Kicked by , ${message.author.tag}`, `Reason , ${reason}`)
                member.kick().then(() => message.channel.send(warnSuccessfulEmbed)).catch(error => message.reply(`Sorry, an error occured.`))
          } else if(command === 'ban'){
                const member = message.mentions.members.first()
              //for user without permission
                var missingPermissionEmbed = getEmbed(warning, 'Insufficient Permissions!', 'You need the `ban_members` permission to use this command!')
              //wrong syntax
                var missingArgsEmbed = getEmbed(warning, 'Missing Arguments!', 'Usage : `ban [@User] [Reason]`')
                var higherRoleEmbed = getEmbed(warning, `Can't Ban User!`, 'This user have higher role than me.')
                if(!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send(missingPermissionEmbed);

                let mentioned = message.mentions.users.first();
                if(!mentioned) return message.channel.send(missingArgsEmbed);

                let reason = args.split(" ").slice(1).join(' ')
                if(!reason) return message.channel.send(missingArgsEmbed);
                if(!member.kickable) return message.channel.send(higherRoleEmbed);

                var banEmbed = getDMEmbed(success, `You've been banned from ${message.guild.name}`, `Banned by , ${message.author.tag}`, `Reason , ${reason}`)
                mentioned.send(banEmbed).catch(error => message.channel.send(`Cannot send ban reason to ${member.user.tag}`));

                var banSuccessfulEmbed = getDMEmbed(success, `${member.user.tag} has been banned.`, `Banned by , ${message.author.tag}`, `Reason , ${reason}`)
                member.kick().then(() => message.channel.send(banSuccessfulEmbed)).catch(error => message.reply(`Sorry, an error occured.`))
          } else if(command === 'prune'){
                const amount = parseInt(args[0])+1
              //for user without permission
                var missingPermissionEmbed = getEmbed(warning, 'Insufficient Permissions!', 'You need the `manage_messages` permission to use this command!')
              //wrong syntax
                var notNumberEmbed = getEmbed(warning, 'Wrong Syntax!', 'That doesn\'t seem to be a valid number.\nUsage : `prune [amount]`')
                var beyondNumberEmbed = getEmbed(warning, 'Number Exceed Limit!', 'Input a number between 1 and 100.\nUsage : `prune [amount]`')
                if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(missingPermissionEmbed);

                if(isNaN(amount)){
                  return message.channel.send(notNumberEmbed)
                } else if(amount <= 1 || amount > 100){
                  return message.reply(beyondNumberEmbed)
                }

                var errorEmbed = getEmbed(error, 'An error occured!', 'There was an error when trying to prune messages.')
                message.channel.bulkDelete(amount).catch(err => {
                    console.console.error(err);
                    message.channel.send(errorEmbed)
                });
          } else if(command === 'selfrole'){
              var roles = ""
              for (var i = 0; i < selfrole.length; i++) {
                roles = roles + selfrole[i] + "\n";
              }
              var embed = getEmbed(information, 'Selfrole list', roles + "\nUsage : `getrole [Role]`")
              message.channel.send(embed)
          } else if(command === 'getrole') {
              var warningEmbed = getEmbed(warning, 'Role not found', `Roles either not in the server or not added as selfrole. Use 'v selfrole' to get a list of available roles.`)
              var i
              for (i = 0; i <= selfrole.length;) {
                if(i === selfrole.length){
                  break;
                } else if(args.toLowerCase() === selfrole[i].toLowerCase()){
                  break;
                } else {
                  i++;
                }
              }
              var role = message.guild.roles.find(role => role.name === selfrole[i]);
              if (!role) {
                message.channel.send(warningEmbed)
              } else {
                if (message.member.roles.has(role.id)) {
                  var embed = getEmbed(success, 'Role Removed', `User already have a ${role} role.\n\nRemoving ${role} role from ${message.author.username}.`)
                  message.member.removeRole(role.id).catch(console.error)
                  message.channel.send(embed)
                } else {
                  var embed = getEmbed(success, 'Role added!', `Add ${message.author.username} a ${role} role.`)
                  message.member.addRole(role.id).catch(console.error)
                  message.channel.send(embed)
                }
              }
          }else {
              var embed = getEmbed(warning, 'Command not found!',`There's no ` + command + ` command. Use 'v help' to get list of command.`)
              message.channel.send(embed)
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
