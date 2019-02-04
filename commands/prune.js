module.exports = args =>{
  const amount = parseInt(args[0])+1

  if(isNaN(amount)){
    return message.reply('that doesnt\'t seem to be a valid number.')
  } else if(amount <= 1 || amount > 100){
    return message.reply('you need to input a number between 2 and 100.')
  } else {
    message.channel.bulkDelete(amount).catch(err => {
      console.console.error(err);
      message.channel.send('There was an error when trying to prune messages in this channel!')
    })
  }
}
