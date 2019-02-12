const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const fs = require("fs");
const unames = JSON.parse(fs.readFileSync("./uname.json", "utf8"));
const request = require("request-promise");
const { promisifyAll } = require('tsubaki');

const Canvas = require("Canvas");
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
      /*
      let artist = "";
      let trackName = "";
      let album = "";
      let cover = "";
      let toImage = "";
      */
      const track = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks=${
          unames[msg.author.id].username
        }&api_key=1336029958418997879ebb165f5fbb3f&limit=1&format=json`
      })
      const lastTrack = res.body.recenttracks.track[0]
      const artist = lastTrack.artist["#text"]
      const trackName = lastTrack.name
      const album = lastTrack.album["#text"]
      const cover = lastTrack.image[1]["#text"]
      /*
      const track = function() {
        request
          .get(
            `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks=${
              unames[msg.author.id].username
            }&api_key=1336029958418997879ebb165f5fbb3f&limit=1&format=json`
          )
          .then(res => {
            const track = res.body.recenttracks.track[0];
            artist = track.artist["#text"];
            trackName = track.name;
            album = track.album["#text"];
            cover = track.image[1]["#text"];
          });
      };*/
      const info = await request({
        uri: `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${
          unames[msg.author.id].username
        }&api_key=1336029958418997879ebb165f5fbb3f&format=json`
      })
      const toImage = info.body.user.image[2]['#text']
     /* const info = function() {
        request
          .get(
            `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${
              unames[msg.author.id].username
            }&api_key=1336029958418997879ebb165f5fbb3f&format=json`
          )
          .then(res => {
            console.log(res.body.user.image[2]["#text"]);
            toImage = res.body.user.image[2]["#text"];
          });
      };*/

      const download = function(url) {
        request
          .get(url)
          .on("response", function(response) {
            console.log(response.statusCode);
            console.log(response.headers["content-type"]);
          })
          .pipe(fs.createWriteStream(path.join(__dirname, "userAvatar.png")));
      };
      
      await download(toImage);

      let toBase = await fs.readFileAsync(path.join(__dirname, "base.png"));
      let toalbumCover = cover;
      let touserAvatar = await fs.readFileAsync(
        path.join(__dirname, "userAvatar.png")
      );
      const canvas = Canvas.createCanvas(600, 150);
      const ctx = canvas.getContext("2d");
      const base = Canvas.loadImage(toBase);
      const userAvatar = Canvas.loadImage(touserAvatar);
      const albumCover = Canvas.loadImage(toalbumCover);
      const generate = () => {
        ctx.drawImage(base, 0, 0);

        //ctx.createLinearGradient(0,0,600,150)
        userAvatar.onload = function() {
          ctx.drawImage(userAvatar, 530, 80, 590, 140);
        };
        albumCover.onload = function() {
          ctx.drawImage(albumCover, 15, 15, 132, 132);
        };
        ctx.fillText(artist, 148, 80, 246);
        ctx.fillText(trackName, 148, 40, 246);
        ctx.fillText(album, 148, 120, 246);
        const imgData = ctx.getImageData(530, 80, 590, 140);
        const data = imgData.data;
        /*for (let i = 0; i < data.length; i += 4) {
                 data[i] = Math.max(255, data[i]);
             }*/
        ctx.putImageData(imgData, 530, 80);
      };

      //userAvatar.src = await userImage.image[1]['#text'];
      generate();
      var buf = canvas.toBuffer();
      var toSend = fs.writeFileSync("test.png", buf);
      return msg.channel
        .send("", { file: "test.png" })
        .catch(err => msg.channel.send(`${(err, name)}: ${err.message}`));
    }
  }
};
