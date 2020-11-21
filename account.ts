import * as fs from "fs";
import { accs_path } from "./bot_config.json";

export class Account {
    path: string
    mentions = false
    current_game = ""
    nnls_stats = {
        mode: "ale",
        ale: {
            current_name: "",
            current_streak: 0,
            best_streak: 0
        },
        ma: {
            current_name: "",
            current_streak: 0,
            best_streak: 0
        },
        toki: {
            current_name: "",
            current_streak: 0,
            best_streak: 0
        }
    }
    als_stats = {
        mode: "pu",
        pu: {
            current_word: "",
            wrong_guesses: 0,
            guessed: new Array<boolean>(),
            wins: 0,
            looses: 0
        },
        nap: {
            current_word: "",
            wrong_guesses: 0,
            guessed: new Array<boolean>(),
            wins: 0,
            looses: 0
        }
    }
    ln_stats = {
        wins: 0,
        looses: 0,
        last_word: "",
        words_left: new Array<string>()
    }

    constructor(user_id: string) {
        this.path = `${accs_path}${user_id}.json`;
        if (fs.existsSync(`${accs_path}${user_id}.json`)) {
            Object.assign(this, JSON.parse(fs.readFileSync(`${accs_path}${user_id}.json`, { encoding: "utf8" })));
        }
        else this.update();
    }

    update(): void {
        fs.writeFileSync(this.path, JSON.stringify(this, null, 4));
    }

    toggle_mentions(): boolean {
        this.mentions = !this.mentions;
        this.update();
        return this.mentions;
    }
}