import * as config from "./bot_config.json";
import { Message } from "discord.js";
import { commands } from "./commands.json";
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

    if (commands.nimi_ni_li_seme.includes(command)) {
        reply((new NimiNiLiSeme(message.author.id)).respond(input));
        return;
    }

    if (commands.alasa_sitelen.includes(command)) {
        reply((new AlasaSitelen(message.author.id)).respond(input))
        return;
    }

    if (commands.linja_nimi.includes(command)) {
        reply((new LinjaNimi(message.author.id)).respond(input));
        return;
    }

    if (str.startsWith("toki")) {
        reply("toki!");
        return;
    }

    if (command == "mu") {
        message.channel.send("mu");
        return;
    }

    if (commands.setting.includes(command)) {
        reply(account.set(args));
        return;
    }

    if (commands.stats.includes(command)) {
        message.channel.send(stats(message.author));
        return;
    }

    if (commands.help.includes(command)) {
        message.channel.send(help(input));
        return;
    }

    if (commands.mama.includes(command)) {
        message.channel.send(mama());
        return;
    }
}