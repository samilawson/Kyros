const { Command } = require("discord.js-commando");
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(__dirname, "../../data/servers.json");

module.exports = class RoleRemoveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "roleremove",
      group: "roleme",
      memberName: "roleremove",
      description: "Removes a role from the roleme list",
      examples: ["removerole updates"],
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
    if (
      !msg.member.permissions.has("ADMINISTRATOR") &&
      msg.author.id !== msg.guild.ownerID
    )
      return msg.reply(
        ":no_entry_sign: [**Invalid Permissions**]: You don't have the **Administrator** permission!"
      );
    if (!data[msg.guild.id].roles) {
      msg.channel.send(":no_entry_sign: No roles found on the roleme list!");
    }
    if (!data[msg.guild.id].roles.includes(role)) {
      msg.channel.send(":no_entry_sign: Role not found in the roleme list!");
    } else {
      data[msg.guild.id].roles.remove(role);
      msg.channel.send(":white_check_mark: Role removed!");
    }
  }
};
