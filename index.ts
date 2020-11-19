require("dotenv").config();
import { Client } from "discord.js";
import { message_listener } from "./message_listener";

const client = new Client();

client.once('ready', () => {
    console.log('Logged in');
});

client.on('message', message_listener);

client.login(process.env.TOKEN);