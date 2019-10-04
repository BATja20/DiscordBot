var Discord = require('discord.js');
var logger = require('winston');
const ytdl = require('ytdl-core');
const fs = require('fs');
var auth = require('./auth.json');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube('AIzaSyA6D2D62JUnbVh4WxrrEepsU5X2Bev5n4o');
var query = '';
// Configure logger settings
/*logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';*/
// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(auth.token);
bot.on('ready', () => {
  console.log('I am ready!');
});
bot.on('message', message=> {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    var messageString = String(message);
    if (messageString.substring(0, 1) == '!') {
        var args = messageString.substring(1).split(' ');
        var cmd = args[0];
        console.log(messageString);
        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                message.channel.send('Pong!');
            case 'play':
                
                const streamOptions = { seek: 0, volume: 1 };
                var broadcast = bot.createVoiceBroadcast();
                if(message.member.voiceChannel)
                {
                    var voiceChannel = message.member.voiceChannel;
                    voiceChannel.join()
                      .then(connection => { 
                        const stream = ytdl('https://www.youtube.com/watch?v=gOMhN-hfMtY', { filter : 'audioonly' });
                        const dispatcher = connection.playStream(stream, streamOptions);
                        dispatcher.on("end", end => {
                            console.log("left channel");
                            voiceChannel.leave();
                        });
                        if(args.length >0)
                        {
                            var url;
                            args.forEach(concat);
                            console.log(1);
                            youtube.searchVideos('Centuries', 4)
                                .then(results => {
                                    console.log(`The video's url is ${results[0].url}`)
                                    url = String(results[0].url);
                                    console.log('url is '+url);

                                })
                                .catch(console.log);
                        }
                        
                      })
                      .catch(err => console.log(err));
                }
            break;
            // Just add any case commands if you want to..
         }
     }
     function concat(string)
     {
        query += string;
     }
});