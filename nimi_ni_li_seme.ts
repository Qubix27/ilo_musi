import { Message } from "discord.js";
import { Game } from "./game";
import { ma, toki } from "./names.json"

export class NimiNiLiSeme extends Game {
    constructor(message: Message, cmd_entered: boolean) {
        super(message, cmd_entered);
        switch (this.account.glob_stats.nnls_mode) {
            case "ma":
                Object.assign(this.dict, ma);
                break;
            case "toki":
                Object.assign(this.dict, toki);
                break;
            case "ale":
                Object.assign(this.dict, ma);
                Object.assign(this.dict, toki);
                break;
        }
    }

    dict: Object = {}

    get stats(): {
        current_name: string,
        current_streak: number
    }
    {
        return this.account.nnls_stats[this.account.glob_stats.nnls_mode];
    }

    respond(input: string): string {
        if (this.cmd_entered) {
            switch (input) {
                case "":
                    this.account.current_game = "nnls";
                    return this.stats.current_name ?
                        `${this.stats.current_name} li seme lon toki Inli?` :
                        this.new_name();
                case "ma taso":
                case "ma":
                    return this.set_dict("ma");
                case "toki taso":
                case "toki":
                    return this.set_dict("toki");
                case "ma en toki":
                case "ale":
                case "ali":
                    return this.set_dict("ale");
                default:
                    return "";
            }
        }
        if (input == "stop") {
            this.account.current_game = "";
            return "";
        }
        if (input.startsWith('-')) {
            this.account.current_game = "";
            return this.check(input.slice(1).trimLeft());
        }
        else return this.check(input.trimLeft()) + "\n" + this.new_name();
    }

    set_dict(mode: string): string {
        this.account.glob_stats.nnls_mode = mode;
        this.account.update_stats();
        return `pona. tenpo ni la mi pana e nimi ${mode}${mode == "ale" ? "" : " taso"} tawa sina.`;
    }

    new_name(): string {
        const keys = Object.keys(this.dict);
        this.stats.current_name = keys[keys.length * Math.random() << 0];
        this.account.update();
        return `${this.stats.current_name} li seme lon toki Inli?`;
    }

    check(name: string): string {
        if (this.dict[this.stats.current_name].map((str: string) => str.toLowerCase()).includes(name)) {
            this.stats.current_name = "";
            this.stats.current_streak++;
            this.account.update();
            return `ni li lon! nanpa linja sina li ${this.stats.current_streak}.`;
        }
        else {
            let str = (name ? "ni li lon ala. " : "") + 
                `${this.stats.current_name} li "${this.dict[this.stats.current_name].join('" anu "')}".`;
            const mode = this.account.glob_stats.nnls_mode;
            if (this.stats.current_streak > this.account.glob_stats[`nnls_${mode}_best`]) {
                this.account.glob_stats[`nnls_${mode}_best`] = this.stats.current_streak;
                str += `\n${this.stats.current_streak} li nanpa linja sewi sin sina!`;
                this.account.update_stats();
            }
            this.stats.current_name = "";
            this.stats.current_streak = 0;
            this.account.update();
            return str;
        }
    }
}