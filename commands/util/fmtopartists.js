const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const request = require('superagent')

module.exports = class FMTopArtistsCommand extends Command {
    constructor(client){
        super(client, {
            name: fmtopartists,
            group: 'util',
            memberName: 'fmtopartists',
            description: 'Shows the top artists ever on Last.fm',

            examples: ['fmtopartists']
        })
    }
    async run(msg){
        const topartists = request.get("http://ws.audioscrobbler.com/2.0/?method=chart.getTopArtists&api_key=1336029958418997879ebb165f5fbb3f&format=json&limit=10")
        topartists.then((res) => {
            
        })
    }
}