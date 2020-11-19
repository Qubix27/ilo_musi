require('dotenv').config();
import { Client, MessageEmbed } from 'discord.js';

const client = new Client();
/*
client.on('ready', () => {
    console.log('I am ready!');
});*/

client.on('message', message => {
    if (message.content == "e") {
        const embed = new MessageEmbed()
            .setTitle("mama")
            .setColor(0x7289da) //blue: 0x0000ff
            .setDescription(
                "<@464904025469616134> li pali e ilo ni.\n" + 
                "<@586692123642822676> li pana pona li alasa e pakala.\n" + 
                "<@385920914472304663> li open e sona pi ilo ni."
            )
        message.channel.send(embed);
    }
});

client.login(process.env.TOKEN);

/*
let user = {
    name: "John",
    age: 25,
    roles: {
        isAdmin: false,
        isEditor: true
    }
};
  
console.log(JSON.stringify(user, ["name", "roles"], 2));
*/