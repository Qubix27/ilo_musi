require("dotenv").config();
import { Client } from "discord.js";
import { message_listener } from "./message_listener";
import { prefix } from "./bot_config.json";

const client = new Client();

client.once('ready', () => {
    client.user.setActivity({name: `type ${prefix}help for help`, type: "PLAYING"});
});

client.on('message', message_listener);

client.login(process.env.TOKEN);