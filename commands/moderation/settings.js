const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const fs = require('fs')
const path = require('path')
const jsonPath = path.join(__dirname, "../../data/servers.json")

module.exports = class SettingsCommand extends Command {
    constructor(client){
        super(client, {
            name: 'settings',
            group: 'moderation',
            memberName: 'settings',
            description: 'Shows the settings for the server',
            examples: ['settings']
        })
    }
    async run(msg){
        const data = JSON.parse(fs.readFileSync(jsonPath), "utf8")
        const embed = new RichEmbed()
        embed.setColor(3447003)
        .setAuthor(`${msg.guild.name} Server Settings`, msg.guild.iconURL)
        .addField(`Join Message`, data[msg.guild.id].joinMessage || 'disabled')
        .addField(`Leave Message`, data[msg.guild.id].leaveMessage || 'disabled')
        .addField(`Join DM`, data[msg.guild.id].joinDM || 'disabled')
        .addField(`Join Role`, data[msg.guild.id].joinRole || 'disabled')
        .addField(`Mod Log`, data[msg.guild.id].modlog || 'disabled')
        .addField(`No Invite`, data[msg.guild.id].noinvite || 'disabled')
        msg.embed(embed)
    }
}