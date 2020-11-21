import { Game } from "./game";
import { Graph } from "./graph";
import { pu } from "./dictionary.json";

export class LinjaNimi extends Game {
    respond(input: string): string {
        const stats = this.account.ln_stats;
        switch (input) {
            case "hint":
                if (!this.cmd_entered) {
                    if (stats.last_word)
                        return this.options(stats.last_word).join(", ");
                    else return "o toki e nimi pi nanpa wan.";
                }
                else return "linja nimi la sina ken kepeken nimi pu taso.";
            case "cancel":
                if (!this.cmd_entered) {
                    if (stats.last_word)
                        return `musi ni pi linja nimi li pini. sina wile ala awen la ${this.end(false)}`;
                    else {
                        this.reset(true);
                        return "musi ni pi linja nimi li pini. sina anpa ala tan ni: sina open ala.";
                    }
                }
                else return "linja nimi la sina ken kepeken nimi pu taso.";
            case "":
                if (this.account.current_game != "ln") return this.start();
                else if (this.account.ln_stats.last_word)
                    return `tenpo ni la sina musi e linja nimi. mi toki e nimi "${this.account.ln_stats.last_word}".`;
                else return "o toki e nimi pi nanpa wan.";
            default:
                if (this.account.current_game == "ln") {
                    let str = "";
                    if (this.cmd_entered)
                        str = `tenpo ni la sina musi e linja nimi. mi toki e nimi "${this.account.ln_stats.last_word}".\n`;
                    if (stats.words_left.includes(input)) {
                        if (stats.last_word && !this.options(stats.last_word).includes(input)) {
                            return str + "sina ken ala kepeken nimi ni tan ni: " + 
                                "pini pi nimi mi en open pi nimi sina li sama ala.";
                        }
                        else if (!this.options(input).length)
                            return str + this.end(true);
                        else return str + this.play(input);
                    }
                    else {
                        if (pu.includes(input))
                            return str + "sina ken ala kepeken nimi ni tan ni: " + 
                                "mi anu sina li kepeken nimi ni lon musi ni.";
                        else return str + "linja nimi la sina ken kepeken nimi pu taso.";
                    }
                }
                else {
                    if (pu.includes(input)) {
                        this.start();
                        return this.play(input);
                    }
                    else return "linja nimi la sina ken kepeken nimi pu taso.";
                }
        }
    }

    start(): string {
        this.account.ln_stats.words_left = pu.slice();
        this.account.current_game = "ln";
        this.account.update();
        return "o toki e nimi pi nanpa wan.";
    }

    end(win: boolean): string {
        this.reset(false);
        win ? this.account.ln_stats.wins++ : this.account.ln_stats.looses++;
        this.account.update();
        return win ? "sina sewi!" : "sina anpa!";
    }

    reset(do_upd: boolean): void {
        this.account.current_game = "";
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