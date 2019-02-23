const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const request = require('superagent')

module.exports = class FMTopTracksCommand extends Command {
    constructor(client){
        super(client, {
            name: 'fmtoptracks',
            group: 'util',
            memberName: 'fmtoptracks',
            description: 'Shows the current top tracks on Last.fm!',

            examples: ['fmtoptracks']
        })

    }

    async run(msg){
        const toptracks = request.get("http://ws.audioscrobbler.com/2.0/?method=chart.getTopTracks&api_key=1336029958418997879ebb165f5fbb3f&format=json&limit=5")
        toptracks.then((res) => {
            let tracks = res.body.tracks;

            const embed = new RichEmbed()
            .setColor(3447003)
            .setTitle(`Top 5 Tracks on Last.fm`)
            .setURL(`https://www.last.fm/charts`)
            .addField(`${tracks.track[0].name} - ${tracks.track[0].artist.name}`, `Playcount: ${tracks.track[0].playcount} | Listeners: ${tracks.track[0].listeners}`)
            .addField(`${tracks.track[1].name} - ${tracks.track[1].artist.name}`, `Playcount: ${tracks.track[1].playcount} | Listeners: ${tracks.track[1].listeners}`)
            .addField(`${tracks.track[2].name} - ${tracks.track[2].artist.name}`, `Playcount: ${tracks.track[2].playcount} | Listeners: ${tracks.track[2].listeners}`)
            .addField(`${tracks.track[3].name} - ${tracks.track[3].artist.name}`, `Playcount: ${tracks.track[3].playcount} | Listeners: ${tracks.track[3].listeners}`)
            .addField(`${tracks.track[4].name} - ${tracks.track[4].artist.name}`, `Playcount: ${tracks.track[4].playcount} | Listeners: ${tracks.track[4].listeners}`)

            msg.channel.send({embed})
    })
}
}