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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const player_1 = require("./player");
const bj = __importStar(require("./bj_config.json"));
const commands_json_1 = require("./commands.json");
const players_hand_1 = require("./players_hand");
const dealers_hand_1 = require("./dealers_hand");
const inf_deck_1 = require("./inf_deck");
class BJGameSession {
    constructor(channel, ...player_ids) {
        this.deck = new inf_deck_1.InfDeck();
        this.newbie_ids = [];
        this.players = new Map();
        this.playersHands = new Set();
        this.channel = channel;
        BJGameSession.activeChannels.set(channel, this);
        player_ids.map(id => new player_1.Player(id, this));
        this.isSingle = (player_ids.length == 1);
        this.isDM = channel instanceof discord_js_1.DMChannel;
    }
    showPlayers() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isSingle) {
                let message = "Now players are:";
                this.players.forEach(player => message += '\n' + player.toString());
                yield this.channel.send(message);
            }
            else {
                const player = [...this.players][0][1];
                yield this.channel.send(this.noDM(`<@${player.id}>, `) + `Your ballance is $${player.balance}`);
            }
        });
    }
    greetNewbies() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.newbie_ids.length != 0) {
                let mentions = '';
                this.newbie_ids.map(id => mentions += `<@${id}>, `);
                yield this.channel.send(this.noDM(mentions) + "Nice to meet you in the game! " +
                    `You get a $${bj.boost} boost to have something to start with!`);
            }
        });
    }
    collectBets() {
        return __awaiter(this, void 0, void 0, function* () {
            let betCount = 0;
            const collector = this.channel.createMessageCollector((msg) => this.players.has(msg.author.id));
            collector.on("collect", (msg) => __awaiter(this, void 0, void 0, function* () {
                const player = this.players.get(msg.author.id);
                if (player.firstHand)
                    return;
                const cont = msg.content.toLowerCase();
                const num_bet = Number.parseInt(cont.startsWith('$') ? cont.substr(1) : cont);
                if (Number.isInteger(num_bet)) {
                    if (num_bet > 0 && num_bet % 2 == 0) {
                        betCount++;
                        new players_hand_1.PlayersHand(player, num_bet);
                        yield msg.react('✅');
                    }
                    else
                        yield msg.reply("Any bet should be a positive even number");
                }
                else if (commands_json_1.betting.same.includes(cont)) {
                    if (player.lastBet) {
                        betCount++;
                        new players_hand_1.PlayersHand(player, player.lastBet);
                        yield msg.react('✅');
                        yield msg.reply("You bet $" + player.lastBet);
                    }
                    else
                        yield msg.reply("That's your first game, you have nothing to compare with");
                }
                else if (commands_json_1.betting.double.includes(cont)) {
                    if (player.lastBet) {
                        betCount++;
                        new players_hand_1.PlayersHand(player, 2 * player.lastBet);
                        yield msg.react('✅');
                        yield msg.reply("You bet $" + player.lastBet);
                    }
                    else
                        yield msg.reply("That's your first game, you have nothing to compare with");
                }
                if (betCount == this.players.size) {
                    this.dealersHand = new dealers_hand_1.DealersHand(this);
                    for (const plr of this.players.values()) {
                        this.playersHands.add(plr.firstHand);
                    }
                    collector.stop();
                }
            }));
            yield this.channel.send(`Please, place your bet${this.isSingle ? '' : 's'}`);
            yield new Promise(resolve => collector.once("end", resolve));
        });
    }
    dealCards() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.send("Now I'm gonna deal the cards");
            for (let i = 0; i < 2; i++) {
                for (const hand of this.playersHands) {
                    hand.hit();
                }
                this.dealersHand.hit();
            }
            yield this.channel.send(this.toString());
        });
    }
    collect1to1() {
        return __awaiter(this, void 0, void 0, function* () {
            const blackjackers = new Set();
            let mentions = '';
            for (const hand of this.playersHands) {
                if (hand.isBlackJack()) {
                    blackjackers.add(hand.owner.id);
                    mentions += `<@${hand.owner.id}>, `;
                }
            }
            if (blackjackers.size == 0)
                return;
            yield this.channel.send(this.noDM(mentions) + "You have blackjack, but I can too. " +
                "Would you like to take 1:1 immedeately?");
            const evenMoneyCollector = this.channel.createMessageCollector((msg) => blackjackers.has(msg.author.id));
            evenMoneyCollector.on("collect", (msg) => __awaiter(this, void 0, void 0, function* () {
                if (commands_json_1.confirm.yes.includes(msg.content)) {
                    const hand = this.players.get(msg.author.id).firstHand;
                    hand.win(1);
                    blackjackers.delete(msg.author.id);
                    yield msg.react('✅');
                    yield msg.reply(`You won $${hand.bet}, congradulations!`);
                }
                else if (commands_json_1.confirm.no.includes(msg.content)) {
                    blackjackers.delete(msg.author.id);
                    yield msg.react('✅');
                }
                if (blackjackers.size == 0)
                    evenMoneyCollector.stop();
            }));
            yield new Promise(resolve => evenMoneyCollector.once("end", resolve));
        });
    }
    collectInsurances() {
        return __awaiter(this, void 0, void 0, function* () {
            const no_blackjackers = new Set();
            let mentions = '';
            for (const hand of this.playersHands) {
                if (!hand.isBlackJack()) {
                    no_blackjackers.add(hand.owner.id);
                    mentions += `<@${hand.owner.id}>, `;
                }
            }
            if (no_blackjackers.size == 0)
                return;
            yield this.channel.send(this.noDM(mentions) + "Would you like to make an insurance bet? " +
                "It pays 2:1 in case of blackjack of mine.");
            const insuranceCollector = this.channel.createMessageCollector((msg) => no_blackjackers.has(msg.author.id));
            insuranceCollector.on("collect", (msg) => __awaiter(this, void 0, void 0, function* () {
                if (commands_json_1.confirm.yes.includes(msg.content)) {
                    const player = this.players.get(msg.author.id);
                    player.insure();
                    no_blackjackers.delete(msg.author.id);
                    yield msg.react('✅');
                    yield msg.reply(`You added a $${player.firstHand.bet / 2} insurance to your main bet`);
                }
                else if (commands_json_1.confirm.no.includes(msg.content)) {
                    no_blackjackers.delete(msg.author.id);
                    yield msg.react('✅');
                }
                if (no_blackjackers.size == 0)
                    insuranceCollector.stop();
            }));
            yield new Promise(resolve => insuranceCollector.once("end", resolve));
        });
    }
    dealerHasBlackjack() {
        return __awaiter(this, void 0, void 0, function* () {
            let insured_mentions = '';
            let blackjack_mentions = '';
            let lost_mentions = '';
            for (const hand of this.playersHands) {
                if (hand.isBlackJack()) {
                    hand.draw();
                    blackjack_mentions += `<@${hand.owner.id}>, `;
                }
                else if (hand.owner.isInsured) {
                    hand.owner.approveInsurance();
                    insured_mentions += `<@${hand.owner.id}>, `;
                }
                else {
                    hand.lose();
                    lost_mentions += `<@${hand.owner.id}>, `;
                }
            }
            if (insured_mentions != '')
                yield this.channel.send(this.noDM(insured_mentions) + "You saved your money thanks to your insurance");
            if (blackjack_mentions != '')
                yield this.channel.send(this.noDM(blackjack_mentions) + "We drew, so your bet goes back");
            if (lost_mentions != '')
                yield this.channel.send(this.noDM(lost_mentions) + "Better luck next time!");
        });
    }
    playHands() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isSingle)
                yield this.channel.send("Let us begin");
            for (const hand of this.playersHands) {
                yield hand.play();
            }
            if (this.playersHands.size != 0) {
                yield this.dealersHand.play();
                yield this.pay();
            }
        });
    }
    playBlackJack() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dealersHand.has10orAce()) {
                yield this.channel.send("I may have blackjack!");
                this.dealersHand.hasAce() ?
                    yield Promise.all([this.collect1to1(), this.collectInsurances()]) :
                    yield this.collect1to1();
                yield this.channel.send("I'm peeking my holecard...");
                if (this.dealersHand.isBlackJack()) {
                    this.dealersHand.hit();
                    yield this.dealersHand.show();
                    yield this.channel.send("I have a blackjack!");
                    yield this.dealerHasBlackjack();
                }
                else {
                    yield this.channel.send("I have no blackjack.");
                    yield this.playHands();
                }
            }
            else
                yield this.playHands();
        });
    }
    pay() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dealersHand.score > 21) {
                for (const hand of this.playersHands) {
                    hand.win();
                }
                yield this.channel.send("I busted! " + (this.isSingle ? "You win" : "Everybody wins") + " 1:1");
                return;
            }
            let lost_mentions = '';
            let drew_mentions = '';
            let won_mentions = '';
            for (const hand of this.playersHands) {
                if (hand.score < this.dealersHand.score) {
                    hand.lose();
                    lost_mentions += `<@${hand.owner.id}>, `;
                }
                else if (hand.score == this.dealersHand.score) {
                    hand.draw();
                    drew_mentions += `<@${hand.owner.id}>, `;
                }
                else {
                    hand.win();
                    won_mentions += `<@${hand.owner.id}>, `;
                }
            }
            if (lost_mentions != '')
                this.channel.send(this.noDM(lost_mentions) + "You lost! Better luck next time...");
            if (drew_mentions != '')
                this.channel.send(this.noDM(drew_mentions) + "We drew! The bet goes back to your wallet");
            if (won_mentions != '')
                this.channel.send(this.noDM(won_mentions) + "You won! It pays you 1:1");
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.send("Thanks for playing!");
            // if (this.isSingle) {
            //     const player_id = [...this.players][0][0];
            //     await this.channel.send(this.noDM(`<@${player_id}>, `) + "One more time?");
            //     //
            // }
            BJGameSession.activeChannels.delete(this.channel);
        });
    }
    setCancellation(resolve) {
        this.cancel = () => {
            this.cancel = () => { };
            this.channel.send("The game is cancelled");
            BJGameSession.activeChannels.delete(this.channel);
            resolve();
        };
    }
    cancel() { }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.setCancellation(resolve);
                yield this.showPlayers();
                yield this.greetNewbies();
                yield this.collectBets();
                yield this.dealCards();
                yield this.playBlackJack();
                yield this.end();
                resolve();
            }));
        });
    }
    noDM(mentions) {
        return this.isDM ? '' : mentions;
    }
    toString() {
        let str = this.dealersHand.toString();
        for (const hand of this.playersHands) {
            str += '\n' + hand.toString();
        }
        return str;
    }
}
exports.BJGameSession = BJGameSession;
BJGameSession.activeChannels = new Map();
