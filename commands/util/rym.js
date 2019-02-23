const { Command } = require("discord.js-commando");
const fs = require("fs");

module.exports = class RYMCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rym",
      group: "util",
      memberName: "rym",
      description: "posts your rateyourmusic.com account",

      examples: ["rym"]
    });
  }

  async run(msg) {
    const unames = JSON.parse(fs.readFileSync("./data/unames.json", "utf8"));
    let toId = msg.author.id;
    if (!unames[toId]) {
      msg.channel.send(
        "Uh oh, it looks like you haven't registered a rateyourmusic account! Type //rymset <accountlink> to register!"
      );
    } else {
      let unames = JSON.parse(fs.readFileSync("./data/unames.json", "utf8"));
      msg.channel.send("Your rym account: " + unames[msg.author.id].rym);
    }
  }
};
