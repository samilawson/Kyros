const { Command } = require("discord.js-commando");
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(__dirname + "../../data/servers.json");

module.exports = class RoleListCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rolelist",
      group: "roleme",
      memberName: "rolelist",
      description: "Shows the list of role me roles",
      examples: ["rolelist"],
      guildOnly: true
    });
  }
  async run(msg) {
    const data = JSON.parse(fs.readFileSync(jsonPath), "utf8");
    if (!data[msg.guild.id].roles) {
      msg.channel.send(
        ":no_entry_sign: There are no roles added to the roleme list!"
      );
    } else {
      let roles = data[msg.guild.id].roles.map(r => r).join(" ");
      msg.channel.send(`Available roles for ${msg.guild.name}: ${roles}`);
    }
  }
};
