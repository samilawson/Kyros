const { Command } = require("discord.js-commando")
const { RichEmbed } = require("discord.js")
const snekfetch = require("snekfetch")

module.exports = class RedditCommand extends Command {
    constructor(client) {
        super(client, {
            name: "reddit",
            group: "fun",
            memberName: "reddit",
            description: "Gets the most recent post from the given subreddit",
            examples: ["reddit learnprogramming"],
            args: [
                {
                    key: 'subreddit',
                    prompt: 'Which subreddit would you like to get a post from?',
                    type: 'string'
                }
            ]
        })
    }
    async run(msg, { subreddit }) {
        try {
            const { body } = await snekfetch.get(`https://reddit.com/r/${subreddit}.json`)
            .query({limit: 1})
            .catch(err => {
                msg.say(`:no_entry_sign: Error: something went wrong!`)
            })
            const embed = new RichEmbed()
            let data = body.data.children[0]
            console.log(data)
            embed.setColor(3447003)
            .setAuthor(`Requested by ${msg.author.username}`, msg.author.avatarURL)
            .setTitle(data.title)
            .setURL(`https://reddit.com${data.permalink}`)
            .setImage(data.url)
            .setFooter(`${data.subreddit_name_prefixed} | ${data.ups}`)
            msg.embed(embed)
        } catch (err) {
            msg.reply(`:no_entry_sign: Error: something went wrong!`)
        }
    }
}