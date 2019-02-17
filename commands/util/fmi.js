const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fs = require("fs");
const unames = JSON.parse(fs.readFileSync("./uname.json", "utf8"));
const request = require("request-promise");
const { promisifyAll } = require("tsubaki");
const { createCanvas, loadImage } = require("Canvas");
const path = require("path");

module.exports = class FmImageCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fmi",
      group: "util",
      memberName: "fmi",
      description: "Shows your last.fm now playing on an image!",

      examples: ["fmi"]
    });
  }

  async run(msg) {
    if (!unames[msg.author.id]) {
      msg.channel.send(
        `@${
          msg.author.id
        }, you don't seem to have your username set! Type !register *username* to set it!`
      );
    } else {
      const track = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${
          unames[msg.author.id].username
        }&api_key=1336029958418997879ebb165f5fbb3f&limit=1&format=json`
      });
      //console.log(track)
      console.log(JSON.parse(track));
      let lastTrack = JSON.parse(track);
      const artist = lastTrack.recenttracks.track[0].artist["#text"];
      const trackName = lastTrack.recenttracks.track[0].name;
      const album = lastTrack.recenttracks.track[0].album["#text"];
      const cover = lastTrack.recenttracks.track[0].image[1]["#text"];
      console.log(cover);
      
      /*var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);
      
          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
      };
      
      download(cover, 'album.png', function(){
        console.log('done');
      });
      */

     /* const info = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${
          unames[msg.author.id].username
        }&api_key=1336029958418997879ebb165f5fbb3f&format=json`
      });
      let toUser = JSON.parse(info);*/

      function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

      const canvas = createCanvas(600, 150);
      const ctx = canvas.getContext("2d");

      
      const trackImage = await loadImage(
        lastTrack.recenttracks.track[0].image[1]["#text"]
      );
      ctx.drawImage(trackImage, 15, 15, 132, 132);
      let rgb = {r:0,g:0,b:0}
      let count;
      const imgData = ctx.getImageData(15, 15, 132, 132);
                const data = imgData.data;
                let i = -4
                while((i += 5 * 4) < data.length){
                  count++;
                  rgb.r += data[i];
                  rgb.g += data[i+1];
                  rgb.b += data[i+2];
                }
                rgb.r = Math.floor(rgb.r/count);
                rgb.g = Math.floor(rgb.g/count);
                rgb.b = Math.floor(rgb.b/count);
                console.log(rgb) // return NaN
      ctx.fillStyle = rgbToHex(rgb.r, rgb.g, rgb.b);
      ctx.rect(0, 0, 600, 150);
      ctx.fill();
      ctx.fillStyle = "black";
      ctx.fillText(artist, 148, 80, 246);
      ctx.fillText(trackName, 148, 40, 246);
      ctx.fillText(album, 148, 120, 246);
      ctx.drawImage(trackImage, 15, 15, 132, 132);

      /*const userImage = await loadImage(toUser.user.image[2]["#text"]);
      ctx.drawImage(userImage, 530, 80, 590, 140);*/

      const attachment = new Discord.Attachment(canvas.toBuffer(), "track.png");
      msg.channel.send(attachment);
    }
  }
};
