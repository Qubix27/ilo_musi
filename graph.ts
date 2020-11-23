class GraphNode {
    in: string[] = [];
    out: string[] = [];
}

export class Graph {
    constructor(dict: string[]) {
        this.map = new Map<string, GraphNode>();

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

    private map: Map<string, GraphNode>;

    in(word: string) {
        return this.map.get(word).in;
    }

    out(word: string) {
        return this.map.get(word).out;
    }

    static last_syllable(word: string): string {
        let syllable = "";
        if (word.endsWith('n')) {
            if (word.length >= 3) syllable = word.slice(word.length - 3);
            else syllable = word;
        }
        else {
            if (word.length >= 2) syllable = word.slice(word.length - 2);
            else syllable = word;
        }
        return syllable;
    }
}