"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const graph_1 = require("./graph");
const dictionary_json_1 = require("./dictionary.json");
class LinjaNimi extends game_1.Game {
    respond(input) {
        const stats = this.account.ln_stats;
        switch (input) {
            case "hint":
            case "h":
                if (stats.game_started) {
                    if (stats.last_word)
                        return this.options(stats.last_word).join(", ");
                    else
                        return "o toki e nimi.";
                }
                else
                    return "sina open ala e musi pi linja nimi.";
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
                else
                    return "sina open ala e musi pi linja nimi.";
            case "":
                return this.start();
            default:
                if (stats.game_started) {
                    if (stats.words_left.includes(input)) {
                        if (stats.last_word && !this.options(stats.last_word).includes(input)) {
                            return "sina ken ala kepeken e nimi ni tan ni: " +
                                "pini pi nimi pini en open pi nimi ni li sama ala.";
                        }
                        else if (!this.options(input).length)
                            return this.end(true);
                        else
                            return this.play(input);
                    }
                    else
                        return "sina ken ala kepeken e nimi ni tan ni: " +
                            "nimi ni li lon pu ala anu ona li kepeken e ni lon musi ni.";
                }
                else {
                    if (dictionary_json_1.pu.includes(input)) {
                        this.start();
                        return this.play(input);
                    }
                    else
                        return "";
                }
        }
    }
    start() {
        if (!this.account.ln_stats.game_started) {
            this.account.ln_stats.words_left = dictionary_json_1.pu.slice();
            this.account.ln_stats.game_started = true;
            this.account.update();
            return "o pana e nimi nanpa wan.";
        }
        else {
            if (this.account.ln_stats.last_word)
                return `tenpo ni la sina jo e musi pi linja nimi. mi toki e "${this.account.ln_stats.last_word}"`;
            else
                return "o pana e nimi nanpa wan.";
        }
    }
    play(word) {
        this.remove(word);
        switch (this.account.ln_stats.difficulty) {
            case 0:
                return this.easy(word);
            case 1:
                return this.hard(word);
        }
    }
    end(win) {
        this.reset(false);
        switch (this.account.ln_stats.difficulty) {
            case 0:
                win ? this.account.ln_stats.easy.wins++ : this.account.ln_stats.easy.looses++;
                break;
            case 1:
                win ? this.account.ln_stats.hard.wins++ : this.account.ln_stats.hard.looses++;
                break;
        }
        this.account.update();
        return win ? "sina sewi!" : "sina anpa!";
    }
    reset(do_upd) {
        this.account.ln_stats.game_started = false;
        this.account.ln_stats.last_word = "";
        this.account.ln_stats.words_left = [];
        if (do_upd)
            this.account.update();
    }
    options(word) {
        const ops = [];
        for (const letter of graph_1.Graph.last_syllable(word)) {
            for (const word2 of this.account.ln_stats.words_left) {
                if (word2.startsWith(letter) && word2 != word) {
                    ops.push(word2);
                }
            }
        }
        return ops;
    }
    remove(word) {
        this.account.ln_stats.words_left.splice(this.account.ln_stats.words_left.indexOf(word), 1);
        this.account.update();
    }
    make_move(options, check = false) {
        const word = options[options.length * Math.random() << 0];
        if (check && !this.options(word).length)
            return `${word}\n${this.end(false)}`;
        this.account.ln_stats.last_word = word;
        this.remove(word);
        return word;
    }
    easy(word) {
        return this.make_move(this.options(word));
    }
    hard(word) {
        const graph = new graph_1.Graph(this.account.ln_stats.words_left);
        const ops = this.options(word);
        const cands = [];
        const targs = graph.targets();
        const dangs = graph.dangerous();
        for (const w of ops) {
            if (!graph.out(w).length)
                return `${w}\n${this.end(false)}`;
            if (targs.includes(w))
                cands.push(w);
        }
        if (!cands.length) {
            cands.push(...ops.filter(w => !dangs.includes(w)));
        }
        return this.make_move(cands.length ? cands : ops);
    }
}
exports.LinjaNimi = LinjaNimi;
