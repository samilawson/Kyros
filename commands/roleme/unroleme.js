const { Command } = require("discord.js-commando");
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(__dirname, "../../data/servers.json");

module.exports = class UnRoleMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "unroleme",
      group: "roleme",
      memberName: "unroleme",
      description: "Remove a roleme role from a user",
      examples: ["unroleme updates"],
      guildOnly: true,
      args: [
        {
          key: "role",
          prompt: "Which role should be removed?",
          type: "role"
        }
      ]
    });
  }
  async run(msg, { role }) {
    const data = JSON.parse(fs.readFileSync(jsonPath), "utf8");
    if (!data[msg.guild.id].roles) {
      msg.channel.send(":no_entry_sign: No roles found in the roleme list!");
    } else {
      if (!data[msg.guild.id].roles.includes(role.name)) {
        msg.channel.send(":no_entry_sign: Role not found!");
      } else {
        let member = await msg.guild.members.fetch(msg.author);
        member.removeRole(role).catch(console.error);
        msg.reply(":white_check_mark: Role " + role.name + " removed!");
      }
    }
  }
};
