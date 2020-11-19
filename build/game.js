"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("./account");
class Game {
    constructor(user_id) {
        this.account = new account_1.Account(user_id);
    }
}
exports.Game = Game;
