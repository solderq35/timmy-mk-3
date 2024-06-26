// Load token from .env file
// Note: requires valid Discord application token to be
// present in a file named .env in project root.
require("dotenv").config();
const prefix = "!";
// Import necessary Discord.js classes
const { Client, Intents } = require("discord.js");

// Instantiate new client object with desired Intents
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ["CHANNEL"],
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
client.on("messageCreate", function (msgInput) {
  //console.log(msg)

  const args = msgInput.content.slice(prefix.length).trim().split(" ");
  const args2 = msgInput.content.trim().split(" ");
  const command = args2.shift().toLowerCase();

  // TESTING: change "time" to "testtime", and "debugtime" to "testdebugtime" or something to avoid triggering prod during local dev
  // For find and replace, add "!" in front of arg names to avoid changing the above comment by accident
  if (command === "!time" || command === "!debugtime") {
    let score = args[1];
    score = parseFloat(score.replace(/,/g, ""));

    let over5Flag = false;
    if (args[2] === "over5") {
      over5Flag = true;
    }
    const baseScore = over5Flag ? 175000 : 210000;
    const baseDivisor = over5Flag ? 50 : 400;
    const lowerTimeBound = over5Flag ? 300 : 0;
    const higherTimeBound = over5Flag ? 1500 : 300;

    const result_array = [];
    // for all 20 possible M values
    for (let i = 1; i <= 20; i++) {
      // base M value multiplier (bonuses and penalties from rating screen)
      let base_M = 5000 * i;

      // base result value (given in seconds:milliseconds. No rounding yet)
      let base_result =
        (baseScore - parseInt(score) * (100000 / parseInt(base_M))) *
        1000 *
        (3 / baseDivisor);

      // error range (difference between upper bound ("base_result") and lower bound)
      let error_range_result =
        0.5 * (100000 / parseInt(base_M)) * 100000 * (3 / baseDivisor);

      // lower bound result value (given in seconds:milliseconds. No rounding yet)
      let lower_bound_result =
        (baseScore - (parseInt(score) + 0.5) * (100000 / parseInt(base_M))) *
        1000 *
        (3 / baseDivisor);

      // higher bound result value (given in seconds:milliseconds. No rounding yet)
      let higher_bound_result =
        (baseScore - (parseInt(score) - 0.5) * (100000 / parseInt(base_M))) *
        1000 *
        (3 / baseDivisor);

      // only calculate if the base result value is within bounds of 0 - 5 minutes
      if (
        base_result >= lowerTimeBound * 1000 &&
        base_result < higherTimeBound * 1000
      ) {
        let formatted_result = formatTime(base_result).formatted_result;
        let formatted_lower_bound =
          formatTime(lower_bound_result).formatted_result;
        let lower_bound_seconds = formatTime(lower_bound_result).seconds;
        let formatted_higher_bound =
          formatTime(higher_bound_result).formatted_result;
        let higher_bound_seconds = formatTime(higher_bound_result).seconds;

        // show 10^-5 seconds (thousandths of a millisecond) for error range delta (plus or minus from original time calc value)
        // all ranges below are the same ms padding logic as in formatTime function, but with *100 for all ranges
        let error_range_milliseconds = Math.floor(error_range_result % 100000);
        let formatted_error_range =
          formatTime(error_range_result).formatted_result;
        if (error_range_milliseconds < 100000) {
          if (error_range_milliseconds < 1000) {
            formatted_error_range = "0.00" + error_range_milliseconds;
          } else if (
            error_range_milliseconds >= 1000 &&
            error_range_milliseconds < 10000
          ) {
            formatted_error_range = "0.0" + error_range_milliseconds;
          } else if (
            error_range_milliseconds >= 10000 &&
            error_range_milliseconds < 100000
          ) {
            formatted_error_range = "0." + error_range_milliseconds;
          }
        }

        let debug_result = `- Original Time Calc: [${formatted_result}](<https://www.google.com/search?q=%28${baseScore}+-+%28${parseFloat(
          score
        )}+*+100000+%2F+${base_M}%29%29+*+%283+%2F+${baseDivisor}%29>)\n  - Time Calc Error Range: ([${formatted_lower_bound}](<https://www.google.com/search?q=%28${baseScore}+-+%28${parseFloat(
          score + 0.5
        )}+*+100000+%2F+${base_M}%29%29+*+%283+%2F+${baseDivisor}%29>), [${formatted_higher_bound}](<https://www.google.com/search?q=%28${baseScore}+-+%28${parseFloat(
          score - 0.5
        )}+*+100000+%2F+${base_M}%29%29+*+%283+%2F+${baseDivisor}%29>)]\n  - Margin of Error (Seconds): ± [${formatted_error_range}](<https://www.google.com/search?q=%280.5+*+100000+%2F+${base_M}%29+*+%283+%2F+${baseDivisor}%29>)\n  - M value: ${base_M}`;
        if (command === "!time") {
          result_array.push(formatted_result);
          if (
            Math.floor(lower_bound_seconds) !== Math.floor(higher_bound_seconds)
          ) {
            let debugCommand = "!debugtime " + score;
            let debugTip =
              "- Potential rounding error detected, for more info check `" +
              debugCommand +
              "`";
            result_array.push(debugTip);
          }
        } else if (command === "!debugtime") {
          result_array.push(debug_result);
        }
      }
    }

    let msgOutput = result_array.join("\n");

    // regex for input validation (only numeric input accepted)
    let num_hyphen_check = /^[0-9]*$/;
    if (
      num_hyphen_check.test(score) == false ||
      score > baseScore ||
      score < 5000 ||
      // if no numbers were returned in range (0 to 5 minutes), it's a bad input
      result_array.length === 0
    ) {
      msgOutput = "Invalid Score :smiling_face_with_3_hearts:";
      let error_output_string = msgOutput.toString();
      msgInput.channel.send(error_output_string);
    } else {
      //console.log(score);
      if (command === "!debugtime") {
        for (let i = 0; i < result_array.length; i++) {
          msgInput.channel.send(result_array[i]);
        }
        let debugInfo =
          "\nM value = Completed SA bonuses (20k each) minus nontarget kills (5k each)\n[Longer Math Explanation](<https://github.com/solderq35/time-calc-under-5/blob/main/README.md#error-calculation>)";
        msgInput.channel.send(debugInfo);
      } else if (command === "!time") {
        let base_output_string = msgOutput.toString();
        msgInput.channel.send(base_output_string);
      }
    }
  }
});

function formatTime(base_result) {
  // let minutes = Math.floor(base_result / (60 * 1000));
  let base_seconds = Math.floor(base_result / 1000);
  let minutes = Math.floor(base_seconds / 60);
  let seconds = Math.floor(base_seconds % 60);

  // milliseconds we multiply by 1000 and then take remainder after dividing by 1000, to eliminate
  // float division rounding errors
  let milliseconds = Math.floor(base_result % 1000);

  // put the minutes / seconds / milliseconds together formatted
  let formatted_result;
  let formatted_seconds;
  let formatted_milliseconds;

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
  return { seconds, formatted_result };
}
