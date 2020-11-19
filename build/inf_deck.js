"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
class InfDeck {
    next() {
        return card_1.Card.Random();
    }
}
exports.InfDeck = InfDeck;
