module.exports = {
  name : 'help',
  execute(message, args){
    message.channel.send("**Prefix : v[space]**\n\n" +
    "**Info : **giving clan information.\n"+
    "**Kick : **kicking member.\n"+
    "**Ban : **ban member.\n"+
    "**Prune : **delete up to 100 messages at once."
  );
  },
}
