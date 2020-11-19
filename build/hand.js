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
class Hand {
    constructor(session) {
        this.cards = [];
        this.score = 0;
        this.softness = 0;
        this.session = session;
    }
    append(card) {
        this.cards.push(card);
        if (card.rank == 'A') {
            this.softness++;
        }
        this.score += card.score;
        if (this.score > 21) {
            if (this.softness > 0) {
                this.score -= 10;
                this.softness--;
            }
        }
    }
    show() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.session.channel.send(this.toString());
        });
    }
}
exports.Hand = Hand;
