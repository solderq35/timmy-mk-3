# Timmy MK 3

Timmy MK 3 is an homage to the original Timmy the Time Bot programmed by Khunee and Juliend10 in Python. I rewrote the Discord bot in JavaScript as I'm more comfortable with it.

See also:

- [HITMAN Milliseconds Time Calc Website](https://solderq35.github.io/time-calc-under-5/)
  - Website version of this bot (since not everyone uses Discord)
  - Also includes a link sharing feature, to easily share calculator results with friends
- [Timmy MK 2 Discord Bot](https://github.com/solderq35/timmy_mk_2)
  - Alternative implementation using AWS Lambda (serverless) for hosting, as well as Discord Slash commands

For a full deep dive into the math behind this, please check [Time Calc Website README](https://github.com/solderq35/time-calc-under-5/blob/main/README.md#mathematics-code-explanation).

## How to Run Your Own Instance

- Before you start, create a `.env` file and include the line `DISCORD_TOKEN=DISCORD_TOKEN_VALUE`, where `DISCORD_TOKEN_VALUE` can be obtained as [explained here](https://www.online-tech-tips.com/computer-tips/what-is-a-discord-token-and-how-to-get-one/)
- Run `npm install` to install dependencies
  - I am on NodeJS version 18.18.2 if it matters
- Run `node index.js` to run locally
- Code formatting: `npm run prettier`
- For server hosting, I used [railway.app](https://railway.app/)

## Documentation

Check [Discord.js v12 documentation](https://v12.discordjs.guide/creating-your-bot/commands-with-user-input.html), as well as [this tutorial I was using](https://www.alpharithms.com/how-to-code-a-discord-bot-in-javascript-444917/)

## Usage Instructions

1. Add the bot to your Discord server using [this URL](https://discord.com/api/oauth2/authorize?client_id=1041152819874508812&permissions=2147486720&scope=bot%20applications.commands), or just DM the bot on Discord at `Timmy MK 3#9573`. Sending commands to the bot in a server and in DM's are both supported.
2. The required inputs are to type `!time SCORE`, where SCORE is the score on the rating screen.
   - You can have commas in your score input.
3. Most video examples from [here](https://www.youtube.com/results?search_query=hitman+3+speedrun&sp=EgIYAQ%253D%253D) or [here](https://www.speedrun.com/hitman_3) will work for getting valid scores. Otherwise, any score value of about 50,000 to 210,000 should work.
   - **NOTE: Only Hitman level completion times of up to 5 minutes are compatible with the bot.**
   - Use the [Time Calc Website](https://solderq35.github.io/time-calc-under-5/over5) for times of 5 to 15 minutes.
4. For this example, let's use [this video](https://www.youtube.com/watch?v=zIRAmZdl-y4), which is an 8 second run of the "On Top of the World" Hitman level.
5. We can see at the end of this video that the score at the end of the video is `83,521`. As shown here: ![Score](static/goronscore.png)
6. Now, let's type `!time 83521`.

![Milliseconds Score](static/timmy-example.png)

7. As you can see, the bot returns a few viable solutions. One of them (8.981) is within a second of the 8 seconds value shown on the rating screen, so this is the milliseconds value we are looking for.

8. In case of rounding errors, you will get a warning, as shown below (example: `!time 204667`):

![debug 1](https://i.ibb.co/kxbjDHN/debugtime1.png)

9. Use the `!debugtime SCORE`, where SCORE is the score on the rating screen as shown below (example: `!debugtime 204667`):

![debug 2](static/debugtime2.png)

If needed, click the individual links on the debug message to see the exact math equations used (cross reference with [Longer Math Explanation](https://github.com/solderq35/time-calc-under-5/blob/main/README.md#error-calculation) link at bottom):

![googleCalc](static/googlecalc.png)

10. You can also use the `over5` optional parameter to calculate milliseconds for runs between 5 and 15 minutes. Use the syntax `!time SCORE over5` or `!debugtime SCORE over5`, as shown below:

![googleCalc](static/over5.png)
