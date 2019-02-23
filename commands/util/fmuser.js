const { Command } = require("discord.js-commando");
const { RichEmbed } = require("discord.js");
const request = require("superagent");
const fs = require("fs");
const unames = JSON.parse(fs.readFileSync("./data/unames.json", "utf8"));

module.exports = class FMUserCommand extends Command {
  constructor(client) {
    super(client, {
      name: "fmuser",
      group: "util",
      memberName: "fmuser",
      description: "Shows your user info.",

      examples: ["fmuser"]
    });
  }

  async run(msg) {
    if (!unames[msg.author.id].username) {
      msg.channel.send(
        `@${
          msg.author.id
        }, you don't seem to have your username set! Type //register yourlastfmusername to set it!`
      );
    } else {
      const user = request.get(
        `http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${
          unames[msg.author.id].username
        }&api_key=1336029958418997879ebb165f5fbb3f&format=json`
      );
      user.then(res => {
        const user = res.body.user;
        let playcount = user.playcount;
        let name = user.name;
        let url = user.url;
        let image = user.image[2]["#text"];
        let toDate = new Date(user.registered.unixtime * 1000);
        let dateString = toDate.toString();
        const embed = new RichEmbed()
          .setColor(3447003)
          .setThumbnail(image)
          .setTitle(name)
          .setURL(url)
          .addField(`Playcount`, playcount, true)
          .addField(`Registered`, dateString, true);

        msg.channel.send({ embed });
      });
    }
  }
};
