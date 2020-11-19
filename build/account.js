"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const bot_config_json_1 = require("./bot_config.json");
class Account {
    constructor(user_id) {
        this.settings = {
            reply: false
        };
        this.gtn_stats = {
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
        };
        this.ln_stats = {
            difficulty: 0,
            easy: {
                wins: 0,
                looses: 0
            },
            hard: {
                wins: 0,
                looses: 0
            },
            game_started: false,
            last_word: "",
            words_left: new Array()
        };
        this.path = `${bot_config_json_1.accs_path}${user_id}.json`;
        if (fs.existsSync(`${bot_config_json_1.accs_path}${user_id}.json`)) {
            Object.assign(this, JSON.parse(fs.readFileSync(`${bot_config_json_1.accs_path}${user_id}.json`, { encoding: "utf8" })));
        }
        else
            this.update();
    }
    update() {
        fs.writeFileSync(this.path, JSON.stringify(this, null, 4));
    }
    change_ln_diff(diff) {
        const diffs = ["pona", "ike"];
        if (!this.ln_stats.last_word) {
            this.ln_stats.difficulty = diff;
            this.update();
            return `pona. tenpo ni la mi musi ${diffs[diff]} tawa sina.`;
        }
        else
            return "musi li open la sina ken ala ante e ike mi.";
    }
    change_gtn_mode(mode) {
        this.gtn_stats.mode = mode;
        this.update();
        return `pona. tenpo ni la mi pana e nimi ${mode} tawa sina.`;
    }
    set(args) {
        if (args.length < 2)
            return "";
        switch (args[0]) {
            case "reply":
            case "r":
                switch (args[1]) {
                    case "on":
                        this.settings.reply = true;
                        this.update();
                        return "nimi sina li pona mute :)";
                    case "off":
                        this.settings.reply = false;
                        this.update();
                        return "jaki kule o weka!";
                    default:
                        return "";
                }
            case "guess-the-name":
            case "gtn":
                switch (args[1]) {
                    case "ma-taso":
                    case "ma":
                        return this.change_gtn_mode("ma");
                    case "toki-taso":
                    case "toki":
                        return this.change_gtn_mode("toki");
                    case "ma-en-toki":
                    case "ale":
                    case "ali":
                        return this.change_gtn_mode("ale");
                    default:
                        return "";
                }
            case "linja-nimi":
            case "ln":
                switch (args[1]) {
                    case "pona":
                    case "easy":
                    case "e":
                        return this.change_ln_diff(0);
                    case "ike":
                    case "hard":
                    case "h":
                        return this.change_ln_diff(1);
                    default:
                        return "";
                }
            default:
                return "";
        }
    }
}
exports.Account = Account;
