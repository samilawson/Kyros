const { Command } = require("discord.js-commando");
const Discord = require("Discord.js");
const Canvas = require("Canvas");
const snekfetch = require("snekfetch");
const { promisifyAll } = require("tsubaki");
const fs = promisifyAll(require("fs"));
const path = require("path");

module.exports = class GreyscaleCommand extends Command {
  constructor(client) {
    super(client, {
      name: "greyscale",

      group: "fun",
      memberName: "greyscale",
      description: "Greyscale a user's avatar colors.",
      args: [
        {
          key: "user",
          prompt: "Which user would you like to greyscale?",
          type: "user"
        }
      ]
    });
  }

  async run(msg, args) {
    const { user } = args;
    const avatarURL = user.avatarURL;
    if (!avatarURL) return msg.say("This user has no avatar.");
    try {
      const Image = Canvas.Image;
      const canvas = Canvas.createCanvas(256, 256);
      const ctx = canvas.getContext("2d");
      const avatar = new Image();
      const generate = () => {
        ctx.drawImage(avatar, 0, 0, 256, 256);
        const imgData = ctx.getImageData(0, 0, 256, 256);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const brightness =
            0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
          data[i] = brightness;
          data[i + 1] = brightness;
          data[i + 2] = brightness;
        }
        ctx.putImageData(imgData, 0, 0);
      };
      const avatarImg = await snekfetch.get(avatarURL);
      avatar.src = avatarImg.body;
      generate();

      const attachment = new Discord.Attachment(
        canvas.toBuffer(),
        "greyscale.png"
      );
      msg.channel.send(attachment);
    } catch (err) {
      return msg.say(`${err.name}: ${err.message}`);
    }
  }
};
