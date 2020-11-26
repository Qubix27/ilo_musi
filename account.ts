import * as fs from "fs";
import { accs_path } from "./bot_config.json";

export class Account {
    id: string
    path: string
    current_game = ""
    nnls_stats = {
        ale: {
            current_name: "",
            current_streak: 0
        },
        ma: {
            current_name: "",
            current_streak: 0
        },
        toki: {
            current_name: "",
            current_streak: 0
        }
    }
    als_stats = {
        pu: {
            current_word: "",
            wrong_guesses: 0,
            guessed: new Array<boolean>()
        },
        nap: {
            current_word: "",
            wrong_guesses: 0,
            guessed: new Array<boolean>()
        }
    }
    ln_stats = {
        last_word: "",
        words_left: new Array<string>()
    }
    glob_stats = {
        mentions: false,
        nnls_mode: "ale",
        nnls_ale_best: 0,
        nnls_ma_best: 0,
        nnls_toki_best: 0,
        als_mode: "pu",
        pu_wins: 0,
        pu_looses: 0,
        nap_wins: 0,
        nap_looses: 0,
        ln_wins: 0,
        ln_looses: 0
    }

    constructor(user_id: string) {
        this.id = user_id;
        this.path = `${accs_path}${user_id}.json`;
        if (fs.existsSync(`${accs_path}${user_id}.json`)) {
            Object.assign(this, JSON.parse(fs.readFileSync(`${accs_path}${user_id}.json`, { encoding: "utf8" })));
        }
        else {
            const global_stats = JSON.parse(fs.readFileSync(`${accs_path}/global_stats.json`, { encoding: "utf8" }));
            if (Object.keys(global_stats).includes(user_id)) {
                Object.assign(this.glob_stats, global_stats[user_id]);
                this.update();
            }
            else {
                Object.assign(global_stats, { [user_id]: this.glob_stats });
                fs.writeFileSync(`${accs_path}/global_stats.json`, JSON.stringify(global_stats, null, 4));
            }
        }
    }

    update(): void {
        fs.writeFileSync(this.path, JSON.stringify(this, null, 4));
    }

    update_stats(): void {
        const glob_stats = JSON.parse(fs.readFileSync(`${accs_path}/global_stats.json`, { encoding: "utf8" }));
        Object.assign(glob_stats[this.id], this.glob_stats);
        fs.writeFileSync(`${accs_path}/global_stats.json`, JSON.stringify(glob_stats, null, 4));
        this.update();
    }

    toggle_mentions(): boolean {
        this.glob_stats.mentions = !this.glob_stats.mentions;
        this.update_stats();
        return this.glob_stats.mentions;
    }
}