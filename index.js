// Load token from .env file
// Note: requires valid Discord application token to be
// present in a file named .env in project root.
require("dotenv").config();
const prefix = "!";
// Import necessary Discord.js classes
const { Client, Intents } = require("discord.js");

// Instantiate new client object with desired Intents
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
  partials: ['CHANNEL',]
});

// Authenticate via environment variable having been loaded
// via the dotenv.config() call earlier.
client.login(process.env.DISCORD_TOKEN);

// Notify successful connection via console
client.on("ready", function (e) {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Wait for message events, check content for match,
// respond cordially to user via reply.
client.on("messageCreate", function (msg) {
  //console.log(msg)

  const args = msg.content.slice(prefix.length).trim().split(" ");
  const args2 = msg.content.trim().split(" ");
  const command = args2.shift().toLowerCase();
  if (command === "!time") {
    const score = args[1];
    const result_array = [];
    // for all 20 possible M values
    for (let i = 1; i <= 20; i++) {
      // base M value multiplier (bonuses and penalties from rating screen)
      var base_M = 5000 * i;

      // base result value (given in seconds:milliseconds. No rounding either.)
      var base_result =
        (parseFloat(210000) - parseFloat((score * 100000) / base_M)) *
        parseFloat(3 / 400);

      // only calculate if the base result value is within bounds of 0 - 5 minutes
      if (base_result > 0 && base_result < 300) {
        var minutes = Math.floor(base_result / 60);
        var seconds = base_result - minutes * 60;

        // milliseconds we multiply by 1000 and then take remainder after dividing by 1000, to eliminate
        // float division rounding errors
        var milliseconds = Math.floor((seconds * 1000) % 1000);

        // put the minutes / seconds / milliseconds together formatted
        var formatted_result;
        var formatted_seconds;
        var formatted_milliseconds;

        // add one leading zero to seconds digit if there are less than 10 seconds
        if (seconds < 10) {
          formatted_seconds = ":0" + Math.floor(seconds);
        } else {
          formatted_seconds = ":" + Math.floor(seconds);
        }

        // add two leading zeros to milliseconds digit if there are less than 10 milliseconds
        if (milliseconds < 10) {
          formatted_milliseconds = ".00" + (milliseconds % 1000);
        }

        // add one leading zero to milliseconds digit if there are 10 to 99 milliseconds
        else if (milliseconds >= 10 && milliseconds < 100) {
          formatted_milliseconds = ".0" + (milliseconds % 1000);
        } else {
          formatted_milliseconds = "." + (milliseconds % 1000);
        }

        formatted_result = minutes + formatted_seconds + formatted_milliseconds;
        result_array.push(formatted_result);
      }
    }

    if (result_array.length > 0) {
      var copymsg = "";
      //result_array.unshift(copymsg);
    }

    // if no numbers were returned in range (0 to 5 minutes), it's a bad input
    else {
      var copymsg = "Input a proper score fucker";
      result_array.unshift(copymsg);
    }

    var msg2 = result_array.join("\n");

    // regex for input validation (only numberic input accepted)
    let num_hyphen_check = /^[0-9]*$/;
    if (
      (num_hyphen_check.test(score) == false ||
        score > 210000 ||
        score < 5000) &&
      result_array.length > 0
    ) {
      msg2 = "Input a proper score fucker";
    }
    //console.log(score);
    var stringscore = msg2.toString();
    msg.channel.send(stringscore);
  }
});
