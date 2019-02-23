const { Command } = require("discord.js-commando");
const fs = require("fs");
module.exports = class RYMSetCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rymset",
      group: "util",
      memberName: "rymset",
      description: "Register your rateyourmusic account here!",

      examples: ["rymset https://rateyourmusic.com/user/~whatever"]
    });
  }

  async run(msg, args) {
    const unames = JSON.parse(fs.readFileSync("./data/unames.json", "utf8"));
    let toId = msg.author.id;
    //if(!unames[toId]){
    unames[msg.author.id].rym = args;
    rym: args;

    fs.writeFile("./data/unames.json", JSON.stringify(unames), err => {
      console.error(err);
    });
    msg.channel.send("Registered!");
  }
};
//}
