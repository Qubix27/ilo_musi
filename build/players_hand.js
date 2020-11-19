"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const hand_1 = require("./hand");
const commands_json_1 = require("./commands.json");
class PlayersHand extends hand_1.Hand {
    constructor(owner, bet) {
        super(owner.session);
        this._bet = 0;
        this.owner = owner;
        owner.account.last_bet = bet;
        this.bet = bet;
        if (!owner.firstHand)
            owner.firstHand = this;
    }
    get bet() {
        return this._bet;
    }
    set bet(value) {
        this.owner.account.balance += this._bet - value;
        this.owner.account.update();
        this._bet = value;
    }
    hit() {
        this.append(this.session.deck.next());
    }
    split() {
        return __awaiter(this, void 0, void 0, function* () {
            let popCard = this.cards.pop();
            if (popCard.rank == 'A') {
                this.softness--;
                this.score--;
            }
            else
                this.score -= popCard.score;
            const newHand = new PlayersHand(this.owner, this.bet);
            this.session.playersHands.add(newHand);
            newHand.append(popCard);
            yield this.play();
            yield newHand.play();
        });
    }
    isBlackJack() {
        return this.cards.length == 2 && this.score == 21;
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cards.length == 1) {
                this.hit();
                yield this.show();
            }
            else if (!this.session.isSingle)
                yield this.show();
            if (this.isBlackJack()) {
                this.win(3 / 2);
                yield this.session.channel.send(this.session.noDM(this.owner.id + ", ") + "Congrats on blackjack! You are payed 3:2");
                return;
            }
            const collector = this.session.channel.createMessageCollector((msg) => msg.author.id == this.owner.id);
            collector.on("collect", (msg) => __awaiter(this, void 0, void 0, function* () {
                const com = msg.content.toLowerCase();
                if (commands_json_1.blackjack.stand.includes(com)) {
                    collector.stop();
                }
                else if (commands_json_1.blackjack.hit.includes(com)) {
                    this.hit();
                    yield this.show();
                    if (this.score == 21)
                        collector.stop();
                    else if (this.score > 21) {
                        this.lose();
                        yield msg.reply("You busted! Better luck next time...");
                        collector.stop();
                    }
                }
                else if (commands_json_1.blackjack.double_down.includes(com)) {
                    if (this.cards.length == 2) {
                        this.bet *= 2;
                        this.hit();
                        yield this.show();
                        if (this.score > 21) {
                            this.lose();
                            yield msg.reply("You busted! Better luck next time...");
                        }
                        collector.stop();
                    }
                    else
                        yield msg.reply("You can double down only on the first move");
                }
                else if (commands_json_1.blackjack.surrender.includes(com)) {
                    if (this.cards.length == 2) {
                        this.bet /= 2;
                        yield msg.reply("You halved your bet down to $" + this.bet);
                        collector.stop();
                    }
                    else
                        yield msg.reply("You can surrender only on the first move");
                }
                else if (commands_json_1.blackjack.split.includes(com)) {
                    if (this.cards.length == 2 && this.cards[0].score == this.cards[1].score) {
                        collector.stop("split");
                    }
                    else
                        yield msg.reply("You can split only on the first move when values of the two cards are the same");
                }
            }));
            yield new Promise(resolve => collector.once("end", (_, reason) => __awaiter(this, void 0, void 0, function* () {
                if (reason == "split")
                    yield this.split();
                resolve();
            })));
        });
    }
    win(coeff = 1) {
        this.owner.account.wins++;
        this.owner.account.deposit((1 + coeff) * this.bet);
        this.session.playersHands.delete(this);
    }
    draw() {
        this.owner.account.draws++;
        this.owner.account.deposit(this.bet);
        this.session.playersHands.delete(this);
    }
    lose() {
        this.owner.account.loses++;
        this.owner.account.update();
        this.session.playersHands.delete(this);
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.session.channel.send(this.session.dealersHand.toString() + '\n' + this.toString());
        });
    }
    toString() {
        let str = '**';
        for (const card of this.cards) {
            str += card.toString() + ' ';
        }
        str += `**(${this.score})${this.bet ? ' $' + this.bet : ''} <@${this.owner.id}>`;
        return str;
    }
}
exports.PlayersHand = PlayersHand;
