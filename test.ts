import { Account } from "./account";
import { Graph } from "./graph";

const words_left = [
    "a",
    "akesi",
    //"ala",
    //"alasa",
    //"ale",
    //"ali",
    //"anpa",
    //"ante",
    //"anu",
    //"awen",
    //"e",
    //"en",
    //"esun",
    "ijo",
    //"ike",
    "ilo",
    //"insa",
    "jaki",
    //"jan",
    //"jelo",
    //"jo",
    "kala",
    //"kalama",
    "kama",
    "kasi",
    "ken",
    //"kepeken",
    //"kili",
    "kin",
    //"kiwen",
    //"ko",
    "kon",
    "kule",
    "kulupu",
    "kute",
    //"la",
    "lape",
    "laso",
    "lawa",
    "len",
    //"lete",
    "li", /////////////////////////////////////////
    "lili",
    "linja",
    "lipu",
    "loje",
    "lon",
    "luka",
    "lukin",
    "lupa",
    //"ma",
    "mama",
    "mani",
    "meli",
    "mi",
    "mije",
    "moku",
    "moli",
    "monsi",
    "mu",
    "mun",
    "musi",
    "mute",
    //"namako",
    //"nanpa",
    //"nasa",
    //"nasin",
    //"nena",
    //"ni",
    //"nimi",
    //"noka",
    "o",
    //"oko",
    //"olin",
    //"ona",
    //"open",
    "pakala",
    "pali",
    "palisa",
    //"pan",
    "pana",
    "pi",
    //"pilin",
    "pimeja",
    "pini",
    "pipi",
    "poka",
    "poki",
    //"pona",
    "pu",
    "sama",
    "seli",
    //"selo",
    "seme",
    "sewi",
    "sijelo",
    //"sike",
    //"sin",
    "sina",
    "sinpin",
    "sitelen",
    //"sona",
    "soweli",
    "suli",
    "suno",
    "supa",
    "suwi",
    "tan",
    "taso",
    "tawa",
    //"telo",
    "tenpo",
    //"toki",
    "tomo",
    //"tu",
    //"unpa",
    "uta",
    //"utala",
    "walo",
    "wan",
    "waso",
    //"wawa",
    //"weka",
    "wile"
]

//const account = new Account("464904025469616134");

function options(word: string): string[] {
    const ops: string[] = []
    for (const letter of Graph.last_syllable(word)) {
        for (const word2 of words_left) {
            if (word2.startsWith(letter) && word2 != word) {
                ops.push(word2);
            }
        }
    }
    return ops;
}

function remove(word: string): void {
    words_left.splice(words_left.indexOf(word), 1);
    //account.update();
}

function play(word: string): void {
    remove(word);
    const graph = new Graph(words_left);
    const ops = options(word);
    let cands: string[] = [];
    let min_out = 1000;
    let out_len = 0;
    for (const w of ops) {
        if (!graph.out(w).length) console.log(w);
        if (graph.out(w).some(next => graph.out(next).length == 0)) continue;
        
        for (const in_ of graph.in(w)) {
            out_len = graph.out(in_).length;
            if (out_len < min_out) {
                min_out = out_len;
                cands = [];
                cands.push(w);
            }
            else if (out_len == min_out && cands[cands.length - 1] != w) {
                cands.push(w)
            }
        }
    }
    if (!cands.length) cands = ops.slice();
    /*const ans = cands[cands.length * Math.random() << 0];
    account.ln_stats.last_word = ans;
    remove(ans);*/
    console.log(cands);
}

play("li");