import { Game } from "./game";
import { Graph } from "./graph";
import { pu } from "./dictionary.json";

export class LinjaNimi extends Game {
    respond(input: string): string {
        const stats = this.account.ln_stats;
        switch (input) {
            case "hint":
            case "h":
                if (stats.game_started) {
                    if (stats.last_word)
                        return this.options(stats.last_word).join(", ");
                    else return "o toki e nimi pi nanpa wan.";
                }
                else return "sina open ala e musi pi linja nimi.";
            case "cancel":
            case "c":
                if (stats.game_started) {
                    if (stats.last_word)
                        return `musi ni pi linja nimi li pini. sina wile ala awen la ${this.end(false)}`;
                    else {
                        this.reset(true);
                        return "musi ni pi linja nimi li pini. sina anpa ala tan ni: sina open ala.";
                    }
                }
                else return "sina open ala e musi pi linja nimi.";
            case "":
                return this.start();
            default:
                if (stats.game_started) {
                    if (stats.words_left.includes(input)) {
                        if (stats.last_word && !this.options(stats.last_word).includes(input)) {
                            return "sina ken ala kepeken nimi ni tan ni: " + 
                                "pini pi nimi mi en open pi nimi sina li sama ala.";
                        }
                        else if (!this.options(input).length)
                            return this.end(true);
                        else return this.play(input);
                    }
                    else {
                        let str = "sina ken ala kepeken nimi ni tan ni: ";
                        if (!pu.includes(input)) str += "nimi ni li pu ala.";
                        else str += "mi anu sina li kepeken nimi ni lon musi ni.";
                        return str;
                    }
                }
                else {
                    if (pu.includes(input)) {
                        this.start();
                        return this.play(input);
                    }
                    else return "";
                }
        }
    }

    start(): string {
        if (!this.account.ln_stats.game_started) {
            this.account.ln_stats.words_left = pu.slice();
            this.account.ln_stats.game_started = true;
            this.account.update();
            return "o toki e nimi pi nanpa wan.";
        }
        else {
            if (this.account.ln_stats.last_word)
                return `tenpo ni la sina jo e musi pi linja nimi. mi toki e nimi "${this.account.ln_stats.last_word}".`;
            else return "o toki e nimi pi nanpa wan.";
        }
    }

    end(win: boolean): string {
        this.reset(false);
        win ? this.account.ln_stats.wins++ : this.account.ln_stats.looses++;
        this.account.update();
        return win ? "sina sewi!" : "sina anpa!";
    }

    reset(do_upd: boolean): void {
        this.account.ln_stats.game_started = false;
        this.account.ln_stats.last_word = "";
        this.account.ln_stats.words_left = [];
        if (do_upd) this.account.update();
    }

    options(word: string): string[] {
        const ops: string[] = []
        for (const letter of Graph.last_syllable(word)) {
            for (const word2 of this.account.ln_stats.words_left) {
                if (word2.startsWith(letter) && word2 != word) {
                    ops.push(word2);
                }
            }
        }
        return ops;
    }

    remove(word: string): void {
        this.account.ln_stats.words_left.splice(this.account.ln_stats.words_left.indexOf(word), 1);
        this.account.update();
    }

    make_move(options: string[], check: boolean = false): string {
        const word = options[options.length * Math.random() << 0];
        if (check && !this.options(word).length) return `${word}\n${this.end(false)}`;
        this.account.ln_stats.last_word = word;
        this.remove(word);
        return word;
    }

    play(word: string): string {
        this.remove(word);
        const graph = new Graph(this.account.ln_stats.words_left);
        const ops = this.options(word);
        let cands: string[] = [];
        let min_out = 1000;
        let out_len = 0;
        for (const w of ops) {
            if (!graph.out(w).length) return `${w}\n${this.end(false)}`;
            
            for (const in_ of graph.in(w)) {
                out_len = graph.out(in_).length;
                if (out_len < min_out) {
                    min_out = out_len;
                    cands = [];
                    cands.push(w);
                }
                else if (out_len == min_out && cands[cands.length - 1] != w) {
                    cands.push(w)
                }
            }
        }
        if (!cands.length) cands = ops.slice();
        cands = cands.filter(w => !graph.dangerous().includes(w));
        if (!cands.length) cands = ops.slice();
        const ans = cands[cands.length * Math.random() << 0];
        this.account.ln_stats.last_word = ans;
        this.remove(ans);
        return ans;
    }
}