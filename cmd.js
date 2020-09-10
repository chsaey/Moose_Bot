const settings = require('./settings.json');
const axios = require("axios");
const giphy = require('giphy-api')(settings.giphy);
const mysql = require('mysql');
//const { MessageAttachment } = require('discord.js');

var connection = mysql.createConnection({
  host: '',
  user: '',
  password: settings.db_pw,
  database: ''
});

connection.connect();

module.exports = {

  roll: function (message) {
    let sides = message.content.replace(new RegExp('.*' + "!roll"), '');
    if (sides == "") {
      message.reply(Math.floor((Math.random() * 6) + 1));
    } else {
      message.reply(Math.floor((Math.random() * sides) + 1));
    }
  },

  question: async function (message) {
    let input = message.content.replace(new RegExp('.*' + "!question "), '');
    const baseApiUrl = 'https://api.wolframalpha.com/v1/result?i=';
    try {
      createApiParams(baseApiUrl, input)
        .then((result, err) => {
          axios.get(result)
            .then((response) => {
              message.reply(response.data);
            }).catch((error) => message.reply("Hmmm... I'm not quite sure."));
        });
    } catch (error) {
      console.log("Couldn't find a response!");
    }
  },

  gif: function (message) {
    let rand = (Math.floor((Math.random() * 10) + 1));
    let gif = message.content.replace(new RegExp('.*' + "!gif"), '');
    giphy.search({
      q: gif,
      limit: 10,
      rating: 'pg-13'
    }, function (err, res) {
      message.reply(res.data[rand].url);
    });
  },
  addgame: (message) => {
    let input = message.content.replace(new RegExp('.*' + "!addgame "), '');
    let values = input.split(" ");
    values[0] = values[0].replace(/_/g, ' ');
    if (values.length > 2 || values.length == 0) {
      message.reply("Input must be as shown: '!addgame TITLE' or '!addgame TITLE LINK'");
    }
    else {
      let sql = `CALL add_game(?,?)`;
      connection.query(sql, [values[0], values[1]], (err, result) => {
        if (err) {
          message.reply("Could not add");
        } else {
          message.reply("Game added!");
          connection.commit();
        }
      });
    }
  },

  listgames: (message) => {
    let sql = `CALL list_games()`;
    connection.query(sql, [], (err, result) => {
      if (err) {
        message.reply("Could not retrieve list")
      }
      else {
        message.reply(JSON.stringify(result[0], null, 2))
      }
    });
  },

  dictionary:(message) => {
    let input = message.content.replace(new RegExp('.*' + "!dictionary "), '');
    const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${input}?key=${settings.webster}`;
    try {
         axios.get(url)
           .then((response) => {
             message.reply(JSON.stringify(response.data[0]["shortdef"][0]));
           }).catch((error) => message.reply("Hmmm... I'm not quite sure."));
 
   } catch (error) {
     console.log("Couldn't find a response!");
   } 
   },

   joke:(message) => {
    const url = `https://official-joke-api.appspot.com/jokes/random`;
    try {
         axios.get(url)
           .then((response) => {
             message.reply(JSON.stringify(response.data.setup) + "..... " +JSON.stringify(response.data.punchline));
           }).catch((error) => message.reply("Hmmm... I'm not quite sure."));
 
   } catch (error) {
     console.log("Couldn't find a response!");
   } 
   }, 


}//end

function createApiParams(baseUrl, input, output = 'string') {
  return new Promise((resolve, reject) => {
    if (typeof input == 'string') {
      resolve(`${baseUrl}${encodeURIComponent(input)}%3F&appid=${settings.wolframA}`);
    }
    else {
      reject(new TypeError(createApiParamsRejectMsg));
    }
  });
}


