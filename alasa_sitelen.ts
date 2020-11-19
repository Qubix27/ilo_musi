import { pu, pre_pu, post_pu } from "./dictionary.json";
import { Game } from "./game";

export class AlasaSitelen extends Game {
    constructor(user_id: string) {
        super(user_id);
        switch (this.account.as_stats.mode) {
            case "un":
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
        guessed: boolean[],
        wins: number,
        looses: number
    }
    {
        return this.account.as_stats[this.account.as_stats.mode];
    }

    respond(input: string): string {
        if (this.stats.current_word == "") return this.start();
        else if (input == "") return this.game_state();
        else return this.check(input);
    }

    start(): string {
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
        this.stats.current_word = "";
        this.stats.wrong_guesses = 0;
        this.stats.guessed = [];
        win ? this.stats.wins++ : this.stats.looses++;
        this.account.update();
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