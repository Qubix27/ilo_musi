import * as config from "./bot_config.json";
import { Message } from "discord.js";
import { NimiNiLiSeme } from "./nimi_ni_li_seme";
import { LinjaNimi } from "./linja_nimi";
import { Account } from "./account";
import { stats } from "./stats";
import { AlasaSitelen } from "./alasa_sitelen";
import { mama } from "./mama";
import { help } from "./help";

export function message_listener(message: Message) {
    if (config.ignore_bots && message.author.bot) return;

    let str = message.content;
    if (!str.startsWith(config.prefix)) return;
    str = str.slice(config.prefix.length);
    const args = str.split(/ +/);
    if (args.length == 0) return;
    const command = args.shift().toLowerCase();
    const input = str.slice(command.length).trimLeft();
    const account = new Account(message.author.id);

    function reply(text: string): void {
        if (text) message.channel.send(
            (account.settings.mentions ? `${message.author} ` : "") + text
        );
    }

    if (str.startsWith("toki")) {
        reply("toki!");
        return;
    }

    switch (command) {
        case 'n':
            reply((new NimiNiLiSeme(message.author.id)).respond(input));
            break;
        case 'a':
            reply((new AlasaSitelen(message.author.id)).respond(input));
            break;
        case 'l':
            reply((new LinjaNimi(message.author.id)).respond(input));
            break;
        case 'set':
            reply(account.set(args));
            break;
        case 'stats':
            message.channel.send(stats(message.author));
            break;
        case 'help':
            message.channel.send(help(input));
            break;
        case 'mu':
            message.channel.send("mu");
            break;
        case 'mama':
            message.channel.send(mama());
            break;
        default:
            break;
    }
}