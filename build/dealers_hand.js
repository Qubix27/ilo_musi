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
const card_1 = require("./card");
const hand_1 = require("./hand");
const init_client_1 = require("./init_client");
class DealersHand extends hand_1.Hand {
    constructor(session) {
        super(session);
        this.session.dealersHand = this;
    }
    hit() {
        if (!this.holeCard) {
            if (this.cards.length == 1) {
                this.cards.push(card_1.Card.back);
                this.holeCard = this.session.deck.next();
            }
            else
                this.append(this.session.deck.next());
        }
        else {
            this.cards.pop();
            this.append(this.holeCard);
            this.holeCard = undefined;
        }
    }
    hasAce() {
        return this.cards[0].rank == 'A';
    }
    has10orAce() {
        return this.cards[0].score >= 10;
    }
    isBlackJack() {
        if (!this.holeCard)
            return this.cards.length == 2 && this.score == 21;
        else
            return this.cards[0].score + this.holeCard.score == 21;
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.session.channel.send("I start playing my hand.");
            while (this.score < 17) {
                this.hit();
                yield this.show();
            }
        });
    }
    toString() {
        let str = '**';
        for (const card of this.cards) {
            str += card.toString() + ' ';
        }
        str += `**(${this.score}) <@${init_client_1.client.user.id}>`;
        return str;
    }
}
exports.DealersHand = DealersHand;
