"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphNode {
    constructor() {
        this.in = [];
        this.out = [];
    }
}
class Graph {
    constructor(dict) {
        this.map = new Map();
        for (const word of dict) {
            this.map.set(word, new GraphNode());
        }
        for (const word of dict) {
            for (const letter of Graph.last_syllable(word)) {
                for (const word2 of dict) {
                    if (word2.startsWith(letter) && word2 != word) {
                        this.in(word2).push(word);
                        this.out(word).push(word2);
                    }
                }
            }
        }
    }
    in(word) {
        return this.map.get(word).in;
    }
    out(word) {
        return this.map.get(word).out;
    }
    static last_syllable(word) {
        let syllable = "";
        if (word.endsWith('n')) {
            if (word.length >= 3)
                syllable = word.slice(word.length - 3);
            else
                syllable = word;
        }
        else {
            if (word.length >= 2)
                syllable = word.slice(word.length - 2);
            else
                syllable = word;
        }
        return syllable;
    }
    deadends() {
        const de = [];
        for (const [word, node] of this.map) {
            if (!node.out.length)
                de.push(word);
        }
        return de;
    }
    dangerous() {
        const dang = [];
        for (const word of this.deadends()) {
            dang.push(...this.in(word));
        }
        return dang;
    }
    targets() {
        let mins = [];
        let min_out = 500;
        for (const [word, node] of this.map) {
            if (node.out.length < min_out) {
                min_out = node.out.length;
                mins = [];
                mins.push(word);
            }
            else if (node.out.length == min_out) {
                mins.push(word);
            }
        }
        const targs = [];
        mins.forEach(w => targs.push(...this.out(w)));
        return targs;
    }
}
exports.Graph = Graph;
