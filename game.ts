import { Message } from "discord.js";
import { Account } from "./account";

export abstract class Game {
    constructor(message: Message, cmd_entered: boolean) {
        this.message = message
        this.account = new Account(message.author.id);
        this.cmd_entered = cmd_entered;
    }

    private message: Message
    protected account: Account
    protected cmd_entered: boolean

    protected abstract respond(input: string): string

    reply(input: string): void {
        const text = this.respond(input);
        this.message.channel.send(
            (this.account.glob_stats.mentions ? `${this.message.author} ` : "") + (text ?? "mi sona ala e wile sina.")
        );
    }
}