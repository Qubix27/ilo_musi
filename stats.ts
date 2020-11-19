import { MessageEmbed, User } from "discord.js";
import { Account } from "./account";

export function stats(user: User): MessageEmbed {
    const account = new Account(user.id);
    return new MessageEmbed()
    .setTitle("lipu nanpa")
    .setDescription(`${user} li jo e nanpa musi ni:`)
    .setColor(0x7289da)
    .addField("__nimi ni li seme?__", "nanpa linja sewi")
    .addField("ale", Math.max(account.nnls_stats.ale.best_streak, account.nnls_stats.ale.current_streak), true)
    .addField("ma taso", Math.max(account.nnls_stats.ma.best_streak, account.nnls_stats.ma.current_streak), true)
    .addField("toki taso", Math.max(account.nnls_stats.toki.best_streak, account.nnls_stats.toki.current_streak), true)
    .addField("__alasa sitelen__", "nanpa pi sewi en anpa")
    .addField("\u200B", "**pu\nn.a.p.**", true)
    .addField("sewi", `${account.as_stats.pu.wins}\n${account.as_stats.un.wins}`, true)
    .addField("anpa", `${account.as_stats.pu.looses}\n${account.as_stats.un.looses}`, true)
    .addField("__linja nimi__", "nanpa pi sewi en anpa")
    .addField("sewi", account.ln_stats.wins, true)
    .addField("anpa", account.ln_stats.looses, true)
}