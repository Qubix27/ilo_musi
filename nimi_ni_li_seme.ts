import { Game } from "./game";
import { ma, toki } from "./names.json"

export class NimiNiLiSeme extends Game {
    constructor(user_id: string) {
        super(user_id);
        switch (this.account.nnls_stats.mode) {
            case "ma":
                Object.assign(this.nimi, ma);
                break;
            case "toki":
                Object.assign(this.nimi, toki);
                break;
            case "ale":
                Object.assign(this.nimi, ma);
                Object.assign(this.nimi, toki);
                break;
        }
    }

    nimi: Object = {}

    get stats(): {
        current_name: string,
        current_streak: number,
        best_streak: number
    }
    {
        return this.account.nnls_stats[this.account.nnls_stats.mode];
    }

    respond(input: string): string {
        if (this.stats.current_name == "") return this.new_name();
        if (input == "") return `${this.stats.current_name} li seme lon toki Inli?`;
        if (input.startsWith('-')) return this.check(input.slice(1).trimLeft());
        else return this.check(input) + "\n" + this.new_name();
    }

    new_name(): string {
        const keys = Object.keys(this.nimi);
        this.stats.current_name = keys[keys.length * Math.random() << 0];
        this.account.update();
        return `${this.stats.current_name} li seme lon toki Inli?`;
    }

    check(name: string): string {
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
                str += `\n${this.stats.current_streak} li nanpa linja sewi sin sina!`;
            }
            this.stats.current_name = "";
            this.stats.current_streak = 0;
            this.account.update();
            return str;
        }
    }
}