import { MessageEmbed, User } from "discord.js";
import { Account } from "./account";

export function stats(user: User): MessageEmbed {
    const account = new Account(user.id);
    return new MessageEmbed()
    .setTitle("lipu nanpa")
    .setDescription(`${user} li jo e nanpa musi ni:`)
    .setColor(0x7289da)
    .addField("__nimi ni li seme?__", "nanpa linja sewi")
    .addField("ale", Math.max(account.glob_stats.nnls_ale_best, account.nnls_stats.ale.current_streak), true)
    .addField("ma taso", Math.max(account.glob_stats.nnls_ma_best, account.nnls_stats.ma.current_streak), true)
    .addField("toki taso", Math.max(account.glob_stats.nnls_toki_best, account.nnls_stats.toki.current_streak), true)
    .addField("__alasa sitelen__", "nanpa pi sewi en anpa")
    .addField("\u200B", "**pu\nn.a.p.**", true)
    .addField("sewi", `${account.glob_stats.pu_wins}\n${account.glob_stats.nap_wins}`, true)
    .addField("anpa", `${account.glob_stats.pu_looses}\n${account.glob_stats.nap_looses}`, true)
    .addField("__linja nimi__", "nanpa pi sewi en anpa")
    .addField("sewi", account.glob_stats.ln_wins, true)
    .addField("anpa", account.glob_stats.ln_looses, true)
}