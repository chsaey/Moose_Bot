const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const cmd = require('./cmd.js');

const commandPrefix = "!";

client.on('ready', () => {
  console.log('I\'m Online');
});

client.on("message", message => {
  if (!message.content.startsWith(commandPrefix) || message.author.bot) {
    return;
  }
  let command = message.content.split(' ', 1);

  switch (command[0]) {
    //Wolfram
    case '!question':
      cmd.question(message);
      break;

    //Giphy
    case "!gif":
      cmd.gif(message);
      break;

    //Dice roll
    case "!roll":
      cmd.roll(message);
      break;

    //Add game
    case "!addgame":
  
      cmd.addgame(message);
      break;

    case "!listgames":

      cmd.listgames(message);
      break;

    case "!dictionary":
      cmd.dictionary(message);
      break;

    case "!dictionary":
      cmd.dictionary(message);
      break;

    case "!joke":  
      cmd.joke(message);
      break;  

    default:
      break;
  }

});

client.login(settings.token);

