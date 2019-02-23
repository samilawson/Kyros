const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const request = require('superagent')

module.exports = class FMTopArtistsCommand extends Command {
    constructor(client){
        super(client, {
            name: 'fmtopartists',
            group: 'util',
            memberName: 'fmtopartists',
            description: 'Shows the top artists ever on Last.fm',

            examples: ['fmtopartists']
        })
    }
    async run(msg){
        const topartists = request.get("http://ws.audioscrobbler.com/2.0/?method=chart.getTopArtists&api_key=1336029958418997879ebb165f5fbb3f&format=json&limit=5")
        topartists.then((res) => {
            let artists = res.body.artists;

            const embed = new RichEmbed()
            .setColor(3447003)
            .setTitle(`Top 5 Artists on Last.fm`)
            .setURL(`https://www.last.fm/charts`)
            .addField(`${artists.artist[0].name}`, `Playcount: ${artists.artist[0].playcount} | Listeners: ${artists.artist[0].listeners}`)
            .addField(`${artists.artist[1].name}`, `Playcount: ${artists.artist[1].playcount} | Listeners: ${artists.artist[1].listeners}`)
            .addField(`${artists.artist[2].name}`, `Playcount: ${artists.artist[2].playcount} | Listeners: ${artists.artist[2].listeners}`)
            .addField(`${artists.artist[3].name}`, `Playcount: ${artists.artist[3].playcount} | Listeners: ${artists.artist[3].listeners}`)
            .addField(`${artists.artist[4].name}`, `Playcount: ${artists.artist[4].playcount} | Listeners: ${artists.artist[4].listeners}`)

            msg.channel.send({embed})
            
        })
    }
}