# Timmy MK 3

Timmy MK 3 is an homage to the original Timmy the Time Bot programmed by Khunee and Juliend10 in Python. I switched to Javascript as I'm more comfortable with it, and AWS hosting for a more stable hosting solution than the original Timmy bot.

For a full deep dive into the math behind this, please check [Time Calc Website README](https://github.com/solderq35/time-calc-under-5/blob/main/README.md#mathematics-code-explanation). This bot mostly works the same, except that this bot can return up to 4 possible values, in return for the user typing in less inputs than the Time Calc Website. I kept it that way as the original Timmy Bot did it the same, and also because the speedrunner users are generally ok with sifting through a few possible answers if they can enter less inputs.

## How to Run Your Own Instance
- Run `node index.js` to run locally
- Alternatively, I hosted this on [railway.app](https://railway.app/)

## Documentation
Check [Discord.js v12 documentation](https://v12.discordjs.guide/creating-your-bot/commands-with-user-input.html), as well as [this tutorial I was using](https://www.alpharithms.com/how-to-code-a-discord-bot-in-javascript-444917/)

## Usage Instructions
1. Add the bot to your Discord server using [this URL](https://discord.com/api/oauth2/authorize?client_id=1041152819874508812&permissions=2147486720&scope=bot%20applications.commands), or just DM the bot on Discord at `Timmy MK 3#9573`. Sending commands to the bot in a server and in DM's are both supported.
2. The required inputs are to type `!time SCORE`, where SCORE is the score on the rating screen.
3. Most video examples from [here](https://www.youtube.com/results?search_query=hitman+3+speedrun&sp=EgIYAQ%253D%253D) or [here](https://www.speedrun.com/hitman_3) will work for getting valid scores. Otherwise, any score value of about 50,000 to 210,000 should work. 
    - **NOTE: Only Hitman level completion times of up to 5 minutes are compatible with the bot.** 
    - Use the [Time Calc Website](https://solderq35.github.io/time-calc-under-5/over5) for times of 5 to 15 minutes.
4. For this example, let's use [this video](https://www.youtube.com/watch?v=zIRAmZdl-y4), which is an 8 second run of the "On Top of the World" Hitman level.
5. We can see that the end of this video that the score at the end of the video is `83,521`. As shown here: ![Score](https://media.discordapp.net/attachments/833505136290299935/993958134945169418/unknown.png?width=947&height=670)
6. Now, let's type `!time 83521`.

![Milliseconds Score](https://media.discordapp.net/attachments/1018323831468851202/1041186855816806481/image.png)

7. As you can see, the bot returns a few viable solutions. One of them (8.981) is within a second of the 8 seconds value shown on the rating screen, so this is the milliseconds value we are looking for. 
