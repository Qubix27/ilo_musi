import { MessageEmbed } from "discord.js";
import { prefix } from "./bot_config.json";

export function help(input: string): MessageEmbed {
    const embed = new MessageEmbed()
    .setColor(0x7289da);
    if (!input.length) {
        return embed
        .setTitle("Help")
        .setDescription(
            "toki! You can play word games in toki pona with me. " + 
            `Here is the list of my commands, type \`${prefix}[command]\` to use one of these. ` + 
            `Type \`${prefix}help [command]\` to get more information about it. musi pona!`
        )
        .addField(
            "__Games / musi__",
            "**nimi ni li seme?** (guess the word) `n`\n" + 
            "**alasa sitelen** (hangman) `a`\n" + 
            "**linja nimi** (word chain) `l`"
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
            .setTitle("nimi ni li seme? (guess the name)")
            .setDescription(
                "Guess a place or language name in toki pona. Try to get a long streak!\n\n" + 
                `\`${prefix}n\` guess a new name (or last one, if there is)\n` + 
                `\`${prefix}n [...]\` make your guess and play again\n` + 
                `\`${prefix}n -[...]\` make your guess and stop`
            );
        case "a":
            return embed
            .setTitle("alasa sitelen (hangman)")
            .setDescription(
                "Guess a toki pona word letter by letter. " + 
                "If your letter occurs many times within the word, only one is shown. " + 
                "You can make only 5 mistakes. At least, no one will be hanged in the end...\n\n" + 
                `\`${prefix}a\` start a new game (or continue the last one, if there is)\n` + 
                `\`${prefix}a [letter]\` make your guess\n` + 
                `\`${prefix}a [word]\` guess the whole word (finishes the game)`
            );
        case "l":
            return embed
            .setTitle("linja nimi (word chain)")
            .setDescription(
                "We play against each other. " + 
                "You say the first word, and " + 
                "every next word must start with a letter in the last word’s syllable " + 
                "(e. g. suno -> olin -> laso -> sike etc.). No word can be repeated within a game. " + 
                "You win if your opponent has no words to continue the chain. " + 
                "Be aware, I am not spitting random words. Beat me if you can!\n\n" + 
                `\`${prefix}l\` start a new game (or continue the last one, if there is)\n` + 
                `\`${prefix}l [...]\` make your turn\n` + 
                `\`${prefix}l hint\` show all of your options\n` + 
                `\`${prefix}l cancel\` cancel the game (counts as loosing)`
            )
        case "set":
            return embed
            .setTitle("Settings")
            .setDescription("This command changes your settings.")
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
            .setDescription(`\`${prefix}stats\` shows your scores in the games.`);
        case "mu":
            return embed
            .setTitle("mu")
            .setDescription("mu")
            .setFooter("mu");
    }
}