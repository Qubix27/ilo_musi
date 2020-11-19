import { MessageEmbed } from "discord.js";
import { prefix } from "./bot_config.json";

export function help(input: string): MessageEmbed {
    const embed = new MessageEmbed()
    .setColor(0x7289da);
    if (!input.length) {
        return embed
        .setTitle("Help")
        .setDescription(
            "toki! You can play word games in toki pona with me.\n" + 
            `Type \`${prefix}help [command]\` for more information. musi pona!`
        )
        .addField(
            "__Games / musi__",
            "**nimi ni li seme?** `n`\n" + 
            "**alasa sitelen** `a`\n" + 
            "**linja nimi** `l`"
        )
        .addField(
            "__Other / ante__",
            "**settings** `set`\n" + 
            "**statistics** `stats`\n" + 
            "**mu** `mu`"
        )
    }
    else switch (input) {
        case "n":
            return embed
            .setTitle("nimi ni li seme?")
            .setDescription(
                "I choose a tokiponized version of a place or language name (e. g. ma Motowa, toki Sumi etc.), and " + 
                "you have to guess its English equivalent. If you succeed, you extend your streak. " + 
                "Otherwise, the streak goes to zero, but the biggest streak is saved.\n\n" + 
                `\`${prefix}n\` show the last unguessed name or choose a new one\n` + 
                `\`${prefix}n [...]\` make your guess and choose a next name\n` + 
                `\`${prefix}n -[...]\` make your guess and stop`
            );
        case "a":
            return embed
            .setTitle("alasa sitelen")
            .setDescription(
                "I choose a toki pona word, and you have to guess it letter by letter. " + 
                "If your letter occurs many times within the word, only one is shown. " + 
                "You can make only 5 mistakes. But no worries, no one will be hanged in the end:)\n\n" + 
                `\`${prefix}a\` start a new game or continue the last one\n` + 
                `\`${prefix}a [letter]\` make your guess\n` + 
                `\`${prefix}a [word]\` guess the whole word (finishes the game)`
            );
        case "l":
            return embed
            .setTitle("linja nimi")
            .setDescription(
                "We play against each other. " + 
                "You say the first word. Every next word must start with a letter in the last word’s syllable " + 
                "(e. g. suno -> olin -> laso -> sike etc.) No word can be repeated within a game. " + 
                "Whoever says the last word wins " + 
                "(opponent has no words to continue the thread or all pu words have been used). " + 
                "Be aware, I am not spitting random words. Beat me if you can!\n\n" + 
                `\`${prefix}l\` start a new game or continue the last one\n` + 
                `\`${prefix}l [...]\` make your turn by the rules\n` + 
                `\`${prefix}l hint\` show all of your options\n` + 
                `\`${prefix}l cancel\` cancel the game. This counts as loosing in your stats.`
            )
        case "set":
            return embed
            .setTitle("Settings")
            .setDescription(
                "This command changes your settings."
            )
            .addField(
                "__nimi ni li seme?__ `n`",
                `\`${prefix}set n ale\` ` + 
                `switch dictionary to all proper names mentioned in the Book (default)\n` + 
                `\`${prefix}set n ma\` switch dictionary to place names only\n` + 
                `\`${prefix}set n toki\` switch dictionary to language names only`
            )
            .addField(
                "__alasa sitelen__ `a`",
                `\`${prefix}set a pu\` switch dictionary to the Book (default)\n` + 
                `\`${prefix}set a nap\` switch dictionary to *nimi ale pona* (pu + unofficial)`                
            )
            .addField(
                "__mentions__ `@`",
                `\`${prefix}set @ off\` turn mentions off (default)\n` + 
                `\`${prefix}set @ on\` turn mentions on`
            );
        case "stats":
            return embed
            .setTitle("Statistics")
            .setDescription("Shows your scores in the games.");
        case "mu":
            return embed
            .setTitle("mu")
            .setDescription("mu")
            .setFooter("mu");
    }
}