"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const names_json_1 = require("./names.json");
class GuessTheName extends game_1.Game {
    constructor(user_id) {
        super(user_id);
        this.nimi = {};
        switch (this.account.gtn_stats.mode) {
            case "ma":
                Object.assign(this.nimi, names_json_1.ma);
                break;
            case "toki":
                Object.assign(this.nimi, names_json_1.toki);
                break;
            case "ale":
                Object.assign(this.nimi, names_json_1.ma);
                Object.assign(this.nimi, names_json_1.toki);
                break;
        }
    }
    get stats() {
        return this.account.gtn_stats[this.account.gtn_stats.mode];
    }
    respond(input) {
        if (this.stats.current_name == "")
            return this.new_name();
        if (input == "")
            return `${this.stats.current_name} li seme lon toki Inli?`;
        if (input.startsWith('-'))
            return this.check(input.slice(1).trimLeft());
        else
            return this.check(input) + "\n" + this.new_name();
    }
    new_name() {
        const keys = Object.keys(this.nimi);
        this.stats.current_name = keys[keys.length * Math.random() << 0];
        this.account.update();
        return `${this.stats.current_name} li seme lon toki Inli?`;
    }
    check(name) {
        if (this.nimi[this.stats.current_name].includes(name)) {
            this.stats.current_name = "";
            this.stats.current_streak++;
            this.account.update();
            return `ni li lon! nanpa linja sina li ${this.stats.current_streak}.`;
        }
        else {
            let str = "ni li lon ala. " +
                `${this.stats.current_name} li "${this.nimi[this.stats.current_name].join('" anu "')}".`;
            if (this.stats.current_streak > this.stats.best_streak) {
                this.stats.best_streak = this.stats.current_streak;
                str += ` ${this.stats.current_streak} li nanpa sewi sin sina!`;
            }
            this.stats.current_name = "";
            this.stats.current_streak = 0;
            this.account.update();
            return str;
        }
    }
}
exports.GuessTheName = GuessTheName;
