const { Command } = require("discord.js-commando");
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(__dirname, "../../data/servers.json");
module.exports = class RoleAddCommand extends Command {
  constructor(client) {
    super(client, {
      name: "roleadd",
      group: "roleme",
      memberName: "roleadd",
      description: "Adds a role to the roleme list",
      examples: ["roleadd updates"],
      guildOnly: true,
      args: [
        {
          key: "role",
          prompt: "Which role should be added?",
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
      data[msg.guild.id].roles.push({ role: role });
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    } else {
      let duplicate = false;
      let toCheck = data[msg.guild.id].roles;
      if(toCheck.includes(role)){
        duplicate = true;
        msg.channel.send("Role is already added!")
        }
        else {
          data[msg.guild.id].roles.push({ role: role });
          fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
        }
      }
    }
  
};
