"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graph_1 = require("./graph");
const dictionary_json_1 = require("./dictionary.json");
/*
function pali(klp: string[]) {
    klp.splice(klp.indexOf("apeja"), 1);
}

//let kulupu = pre_pu;
console.log(pre_pu);
console.log();
pali(pre_pu.concat());
console.log(pre_pu);*/
let graph = new graph_1.Graph(dictionary_json_1.pu);
console.log(graph.targets());
/*
for (const [ word, node ] of graph.map.entries()) {
    console.log(`-> ${word} | in: [${node.in.join(' ')}] out: [${node.out.join(' ')}]`);
}*/
/*
let user = {
    name: "John",
    age: 25,
    roles: {
        isAdmin: false,
        isEditor: true
    }
};
  
console.log(JSON.stringify(user, ["name", "roles"], 2));
*/ 
