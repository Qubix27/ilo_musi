import { Message } from "discord.js";
import { Account } from "./account";

export abstract class Game {
    constructor(user_id: string) {
        this.account = new Account(user_id);
    }

    account: Account
    abstract respond(input: string): string
}