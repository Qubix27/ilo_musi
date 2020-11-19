"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_json_1 = require("./commands.json");
const config = __importStar(require("./bot_config.json"));
const guess_the_name_1 = require("./guess_the_name");
const linja_nimi_1 = require("./linja_nimi");
const account_1 = require("./account");
function initClient() {
    const client = new discord_js_1.Client();
    client.once('ready', () => {
        console.log('Logged in!');
    });
    client.on('message', message => {
        if (config.ignore_bots && message.author.bot)
            return;
        let str = message.content;
        if (!str.startsWith(config.prefix))
            return;
        str = str.slice(config.prefix.length);
        const args = str.split(/ +/);
        if (args.length == 0)
            return;
        const command = args.shift().toLowerCase();
        const input = str.slice(command.length).trimLeft();
        const account = new account_1.Account(message.author.id);
        function reply(text) {
            if (text)
                account.settings.reply ? message.reply(text) : message.channel.send(text);
        }
        if (str.startsWith("toki")) {
            reply("toki!");
            return;
        }
        if (commands_json_1.commands.setting.includes(command)) {
            reply(account.set(args));
            return;
        }
        if (commands_json_1.commands.guess_the_name.includes(command)) {
            reply((new guess_the_name_1.GuessTheName(message.author.id)).respond(input));
            return;
        }
        if (commands_json_1.commands.linja_nimi.includes(command)) {
            reply((new linja_nimi_1.LinjaNimi(message.author.id)).respond(input));
            return;
        }
    });
    return client;
}
exports.initClient = initClient;
