"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("./account");
class Player {
    constructor(user_id, session) {
        this.isInsured = false;
        this.id = user_id;
        this.session = session;
        session.players.set(user_id, this);
        this.account = new account_1.Account(user_id);
        if (account_1.Account.exists(user_id)) {
            this.account.config(account_1.Account.get(user_id));
        }
        else {
            this.account.update();
            session.newbie_ids.push(user_id);
        }
    }
    toString() {
        return `<@${this.id}> $${this.account.balance}`;
    }
    get lastBet() {
        return this.account.last_bet;
    }
    get balance() {
        return this.account.balance;
    }
    insure() {
        this.isInsured = true;
        this.account.withdraw(this.firstHand.bet / 2);
    }
    approveInsurance() {
        this.account.draws++;
        this.account.deposit(this.firstHand.bet * 3 / 2);
    }
}
exports.Player = Player;
