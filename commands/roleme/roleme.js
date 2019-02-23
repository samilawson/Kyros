const { Command } = require("discord.js-commando");
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(__dirname, "../../data/servers.json");

module.exports = class RoleMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "roleme",
      group: "roleme",
      memberName: "roleme",
      description: "Gives you the input role if it is in the role me list",
      examples: ["roleme updates"],
      guildOnly: true,
      args: [
        {
          key: "role",
          prompt: "Which role do you want?",
          type: "role"
        }
      ]
    });
  }
  async run(msg, { role }) {
    const data = JSON.parse(fs.readFileSync(jsonPath), "utf8");
    if (!data[msg.guild.id].roles) {
      msg.channel.send("No roles are added to the roleme list!");
    } else {
      if (!data[msg.guild.id].roles.includes(role.name)) {
        msg.channel.send("Role not found!");
      } else {
        let member = await msg.guild.members.fetch(msg.author);
        member.addRole(role).catch(console.error);
        msg.reply(":white_check_mark: Role " + role.name + " added!");
      }
    }
  }
};
