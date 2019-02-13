const { Command } = require("discord.js-commando");
const Discord = require("discord.js");
const fs = require("fs");
const unames = JSON.parse(fs.readFileSync("./uname.json", "utf8"));
const request = require("request-promise");
const { promisifyAll } = require('tsubaki');

const Canvas = require("Canvas");
const Image = require('Canvas').Image; 

const path = require("path");
const https = require("https");
const getProp = require("dotprop");

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
      })
      //console.log(track)
      console.log(JSON.parse(track))
      let lastTrack = JSON.parse(track)
      //const lastTrack = track.recenttracks.track
      const artist = lastTrack.recenttracks.track[0].artist["#text"]
      const trackName = lastTrack.recenttracks.track[0].name
      const album = lastTrack.recenttracks.track[0].album["#text"]
      const cover = lastTrack.recenttracks.track[0].image[1]["#text"]
      console.log(cover)
      const info = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${
          unames[msg.author.id].username
        }&api_key=1336029958418997879ebb165f5fbb3f&format=json`
      })
      let toUser = JSON.parse(info)
      const toImage = toUser.user.image[2]['#text']
      console.log(toImage)
     

      function loadImage(url) {
        return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = url; });
      }
      
      var img = await loadImage(toImage)
      var nextImg = await loadImage(cover)
      //let toBase = await fs.readFileSync(path.join(__dirname, "base.png"));
      
    
      
      const canvas = Canvas.createCanvas(600, 150);
      const ctx = canvas.getContext("2d");
      //const base = Canvas.loadImage(toBase);
      const userAvatar = new Image()
      const albumCover = new Image()
      //const generate = () => {
        ctx.beginPath();
        ctx.fillStyle = "white"
        ctx.rect(0,0,600,150)
        ctx.fill()

        //ctx.createLinearGradient(0,0,600,150)
        userAvatar.onload = function() {
          ctx.drawImage(userAvatar, 530, 80, 590, 140);
        };
        albumCover.onload = function() {
          ctx.drawImage(albumCover, 15, 15, 132, 132);
        };
        ctx.fillStyle = "black"
        ctx.fillText(artist, 148, 80, 246);
        ctx.fillText(trackName, 148, 40, 246);
        ctx.fillText(album, 148, 120, 246);

        const imgData = ctx.getImageData(530, 80, 590, 140);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
                 data[i] = Math.max(255, data[i]);
             }
        ctx.putImageData(imgData, 530, 80);
      //};

      userAvatar.src = toImage
      albumCover.src = cover
      //generate();
      /*var buf = canvas.toBuffer();
      var toSend = fs.writeFileSync("test.png", buf);
      return msg.channel
        .send("", { file: "test.png" })
        .catch(err => msg.channel.send(`${(err, name)}: ${err.message}`));*/

        const attachment = new Discord.Attachment(canvas.toBuffer(), 'track.png');

	      msg.channel.send(attachment);
    }
  }
};
