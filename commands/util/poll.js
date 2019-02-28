const { Command } = require("discord.js-commando")

const poll = {};

module.exports = class PollCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'poll',
            group: 'util',
            memberName: 'poll',
            description: 'Creates a poll',
            examples: ['poll Cats or dogs? | Dogs | Cats']
        })
    }
    async run(msg){
        let prefix = this.client.commandPrefix;
        let noPrefix = msg.content.slice(prefix.length);
        let split = noPrefix.split(" ");
        let cmd = split[0];
        split = split.slice(1);
        let args = split;
        let id = msg.channel.id;

        if(poll[id]) return msg.say(`:no_entry_sign: There is already a poll running in this channel!`)
        if(!args[0]) return msg.say(`To create a poll: ${prefix}poll <question> | <option one> | <option two> | <more options>`);
        let mSplit = args.join(' ').split("|");
        if(!mSplit[0]) return msg.say(`You must split your poll options using |`);
        if(!mSplit[1]) return msg.say(`You must have two or more options to make a poll!`);
        if(!mSplit[2]) return msg.say(`You must have two or more options to make a poll!`);
        poll[id] = {
            id,
            question: split[0],
            auth: msg.author.id,
            voted: {}
        }
        mSplit.shift();
        let opt = {}
        for(let i = 0; i < mSplit.length; i++){
            opt[i + 1] = {
                text: mSplit[i],
                votes: 0
            }
        }
        poll[id].opt = opt
        let ar = []
        let num = 1
        Object.keys(opt).forEach(r => {
            ar.push(num + '. ' + opt[r].text) + '';
            num++
        })
        let text = '__**' + poll[id].question + '**__\n\n*You can vote with `' + prefix + 'vote <optionNum>`*\n\n**' + ar.join('\n') + '**\n\n*The creator of this poll or a server admin can end the poll early by typing `endpoll` in chat. Otherwise it will go for 2 minutes.*';
        msg.say(text, {
            split: true
        })
        let collect = msg.channel.createMessageCollector(m => {
            if(m.author.bot) return false
            if(m.content.startsWith(prefix + 'vote') || m.content === 'endpoll') return true
            else return false;
        }, {
            time: 180000
        })
        collect.on('collect', (m) => {
            let id = m.channel.id;
            if (m.content === 'endpoll') {
                if(poll[id].auth === m.author.id) return collect.stop('early');
                else if(m.channel.permissionsFor(m.member).has('MANAGE_CHANNELS')) return collect.stop('early')
                else return;
            } else {
                m.delete()
                if(poll[id].voted[m.author.id]) return m.reply('You have aleady voted!')
                let sp = m.content.split(' ')
                if(!sp[1]) return m.reply('Provide the option number you are voting for')
                let tot = Object.keys(poll[id].opt).length
                let num = parseInt(sp[1]) || 0;
                
            }
        })
    }
}