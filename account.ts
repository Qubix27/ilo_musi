import * as fs from "fs";
import { accs_path } from "./bot_config.json";

export class Account {
    path: string
    settings = {
        mentions: false
    }
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
    as_stats = {
        mode: "pu",
        pu: {
            current_word: "",
            wrong_guesses: 0,
            guessed: new Array<boolean>(),
            wins: 0,
            looses: 0
        },
        un: {
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
        game_started: false,
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

    change_nnls_mode(mode: string): string {
        this.nnls_stats.mode = mode;
        this.update();
        return `pona. tenpo ni la mi pana e nimi ${mode}${mode == "ale" ? "" : " taso"} tawa sina.`;
    }

    change_as_mode(mode: string): string {
        this.as_stats.mode = mode;
        this.update();
        return `pona. tenpo ni la mi pana e nimi ${mode == "pu" ? "pu taso" : "ale pona"}` + 
        ` tawa sina lon musi pi alasa sitelen.`;
    }

    set(args: string[]): string {
        if (args.length != 2) return "";
        switch (args[0]) {
            case "@":
                switch (args[1]) {
                    case "on":
                        this.settings.mentions = true;
                        this.update();
                        return "o, nimi sina li pona mute :)";
                    case "off":
                        this.settings.mentions = false;
                        this.update();
                        return "jaki o weka!";
                    default:
                        return "";
                }
            case "n":
                switch (args[1]) {
                    case "ma":
                        return this.change_nnls_mode("ma");
                    case "toki":
                        return this.change_nnls_mode("toki");
                    case "ale":
                    case "ali":
                        return this.change_nnls_mode("ale");
                    default:
                        return "";
                }
            case "a":
                switch (args[1]) {
                    case "pu":
                        return this.change_as_mode("pu");
                    case "nap":
                        return this.change_as_mode("un");
                }
            default:
                return "";
        }
    }
}