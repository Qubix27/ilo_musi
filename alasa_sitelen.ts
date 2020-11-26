import { Message } from "discord.js";
import { pu, pre_pu, post_pu } from "./dictionary.json";
import { Game } from "./game";

export class AlasaSitelen extends Game {
    constructor(message: Message, cmd_entered: boolean) {
        super(message, cmd_entered);
        switch (this.account.glob_stats.als_mode) {
            case "nap":
                this.dict.push(...pre_pu);
                this.dict.push(...post_pu);
            case "pu":
                this.dict.push(...pu);
                break;
        }
    }

    dict: string[] = []
    max_mistakes = 5

    get stats(): {
        current_word: string,
        wrong_guesses: number,
        guessed: boolean[]
    }
    {
        return this.account.als_stats[this.account.glob_stats.als_mode];
    }

    respond(input: string): string {
        if (this.cmd_entered) {
            switch (input) {
                case "":
                    return this.stats.current_word ? this.game_state() : this.start();
                case "pu taso":
                case "pu":
                    return this.set_dict("pu");
                case "nimi ale pona":
                case "nap":
                    return this.set_dict("nap");
                default:
                    return "";
            }
        }
        else if (!input) return this.game_state()
        else return this.check(input);
    }

    set_dict(mode: string): string {
        this.account.glob_stats.als_mode = mode;
        this.account.update_stats();
        return `pona. tenpo ni la mi pana e nimi ${mode == "pu" ? "pu taso" : "ale pona"}` + 
        ` tawa sina lon musi pi alasa sitelen.`;
    }

    start(): string {
        this.account.current_game = "als";
        this.stats.current_word = this.dict[this.dict.length * Math.random() << 0];
        for (const _ of this.stats.current_word) this.stats.guessed.push(false);
        this.account.update();
        return this.game_state();
    }

    check(input: string): string {
        if (input.length == 1) {
            const matched_indices: number[] = [];
            for (let i = 0; i < this.stats.current_word.length; i++) {
                if (this.stats.current_word[i] == input && !this.stats.guessed[i]) matched_indices.push(i);
            }

            if (matched_indices.length) {
                const index = matched_indices[matched_indices.length * Math.random() << 0];
                this.stats.guessed[index] = true;
                if (this.stats.guessed.every(b => b)) {
                    return this.game_state() + this.end(true);
                }
            }
            else if (++this.stats.wrong_guesses == this.max_mistakes) {
                this.stats.guessed.fill(true);
                return this.game_state() + this.end(false);
            }

            this.account.update();
            return this.game_state();
        }
        else {
            this.stats.guessed.fill(true);
            if (this.stats.current_word == input) {
                return this.game_state() + this.end(true);
            }
            else {
                return this.game_state() + this.end(false);
            }
        }
    }

    end(win: boolean): string {
        this.account.current_game = "";
        this.stats.current_word = "";
        this.stats.wrong_guesses = 0;
        this.stats.guessed = [];
        const mode = this.account.glob_stats.als_mode;
        win ? this.account.glob_stats[mode + "_wins"]++ : this.account.glob_stats[mode + "_looses"]++;
        this.account.update_stats();
        return win ? "\nsina sewi!" : "\nsina anpa!";
    }

    game_state(): string {
        let str = "";
        for (let i = 0; i < this.stats.current_word.length; i++) {
            str += `__\`${this.stats.guessed[i] ? this.stats.current_word[i] : ' '}\`__\u200A`;
        }
        str += " | `";
        for (let i = 0; i < this.max_mistakes; i++) {
            str += i < this.stats.wrong_guesses ? 'X' : 'O';
        }
        str += '`';
        return str;
    }
}