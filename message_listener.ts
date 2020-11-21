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
    if (!message.content.startsWith(config.prefix)) return;
    if (config.ignore_bots && message.author.bot) return;

    const str = message.content.slice(config.prefix.length);
    const command = str.split(/ +/)[0].toLowerCase();
    const input = str.slice(command.length).trimLeft();
    const account = new Account(message.author.id);

    switch (command) {
        case "nnls":
            new NimiNiLiSeme(message, true).reply(input);
            break;
        case "als":
            new AlasaSitelen(message, true).reply(input);
            break;
        case "ln":
            new LinjaNimi(message, true).reply(input);
            break;
        case "stats":
            message.channel.send(stats(message.author));
            break;
        case "help":
            message.channel.send(help(input));
            break;
        case "credits":
            message.channel.send(mama());
            break;
        case "@":
            message.channel.send(
                account.toggle_mentions() ? `${message.author} o, nimi sina li pona a:)` : "jaki o weka!"
            );
            break;
        default:
            switch (account.current_game) {
                case "nnls":
                    new NimiNiLiSeme(message, false).reply(str);
                    break;
                case "als":
                    new AlasaSitelen(message, false).reply(str);
                    break;
                case "ln":
                    new LinjaNimi(message, false).reply(str);
                    break;
            }
    }
}