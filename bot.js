var Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
var auth = require('./auth.json');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(auth.youtubeToken);
var query = '';
var dispatcher = null;
var stopped = true, paused = false;
// Initialize Discord Bot
const bot = new Discord.Client();
bot.login(auth.token);
bot.on('ready', () => {
  console.log('I am ready!');
});
bot.on('message', message=> {

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
            break;
            case 'play':
                if(message.member.voiceChannel)
                {
                    args.forEach(concat);
                    var voiceChannel = message.member.voiceChannel;
                        voiceChannel.join()
                          .then(connection => { 
                                playMusic(query,connection);
                                query = '';
                          })
                          .catch(err => console.log(err));
                }
                else
                    message.channel.send('You need to be in a voice channel to do that command.');
            break;
            case 'stop':
                  if(!stopped || dispatcher == null)
                  {
                      dispatcher.end();
                      dispatcher.on('end', () => {
                          stopped = true;
                      });
                  }
                  else
                      message.channel.send('There is nothing to stop! I CANT STHAP!');
            break;
            case 'pause':
                  if(!paused || dispatcher != null)
                  {
                      dispatcher.pause();
                      paused = true;
                  }
                  else
                      message.channel.send('WHERE IS THE PAUSE BUTTON?!');
            break;
            case 'resume':
                  if(paused || dispatcher != null)
                  {
                      dispatcher.resume();
                      paused = false;
                  }
                  else
                      message.channel.send('Here is my resume. *slowly slides in CV*');
            break;
         }
     }
     
});
function concat(string)
     {
        query += string+' ';
        return;
     }

async function playMusic(query,connection)
     {
        const streamOptions = { seek: 0, volume: 1 };
        var url = String(await searchForVideo(query));
        console.log('type of url' +url+' is '+typeof url);
        var broadcast = bot.createVoiceBroadcast();
        if(ytdl.validateURL(url))
        {
            const stream = ytdl( url , { filter : 'audioonly' });
            dispatcher = connection.playStream(stream, streamOptions);
            stopped = false;
        }
        else
            console.log('Couldn\'t validate URL');
        return;
     }

function searchForVideo(query)
     {
         console.log(query);
         return new Promise(function(resolve,reject){
             youtube.searchVideos(query, 1)
                            .then(results => {
                                console.log(`The video's url is ${results[0].url}`)
                                resolve(results[0].url);                               
                                })
                                .catch(console.log);
         })
     }