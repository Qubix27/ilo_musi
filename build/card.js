"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Card {
    constructor(rank, suit) {
        this.rank = ranks[rank];
        this.suit = suits[suit];
        this.score = scores[rank];
    }
    static singleDeck() {
        let deck = [];
        for (let suit = 0; suit < 4; suit++) {
            for (let rank = 0; rank < 13; rank++) {
                deck.push(new Card(rank, suit));
            }
        }
        return deck;
    }
    static Random() {
        return new Card(Math.floor(Math.random() * 13), Math.floor(Math.random() * 4));
    }
    toString() {
        return this.rank + this.suit;
    }
}
exports.Card = Card;
Card.back = {
    rank: '',
    suit: '',
    score: 0,
    toString: () => '##'
};
const suits = ['♤', '♡', '♧', '♢'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const scores = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
