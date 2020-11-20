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
            "**nimi ni li seme?** (guess the word) `nnls`\n" + 
            "**alasa sitelen** (hangman) `als`\n" + 
            "**linja nimi** (word chain) `ln`"
        )
        .addField(
            "__Other / ante__",
            "**settings** `set`\n" + 
            "**statistics** `stats`\n" + 
            "**mu** `mu`"
        )
    }
    else switch (input) {
        case "nnls":
        case "n":
            return embed
            .setTitle("nimi ni li seme? (guess the name)")
            .setDescription(
                "Guess a place or language name in toki pona. Try to get a long streak!\n\n" + 
                `\`${prefix}nnls\` guess a new name (or last one, if there is)\n` + 
                `\`${prefix}nnls [...]\` make your guess and play again\n` + 
                `\`${prefix}nnls -[...]\` make your guess and stop`
            )
            .setFooter("alias: `n`");
        case "als": 
        case "a":
            return embed
            .setTitle("alasa sitelen (hangman)")
            .setDescription(
                "Guess a toki pona word letter by letter. " + 
                "If your letter occurs many times within the word, only one is shown. " + 
                "You can make only 5 mistakes. At least, no one will be hanged in the end...\n\n" + 
                `\`${prefix}als\` start a new game (or continue the last one, if there is)\n` + 
                `\`${prefix}als [letter]\` make your guess\n` + 
                `\`${prefix}als [word]\` guess the whole word (finishes the game)`
            )
            .setFooter("alias: `a`");
        case "ln":
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
                `\`${prefix}ln\` start a new game (or continue the last one, if there is)\n` + 
                `\`${prefix}ln [...]\` make your turn\n` + 
                `\`${prefix}ln hint\` show all of your options\n` + 
                `\`${prefix}ln cancel\` cancel the game (counts as loosing)`
            )
            .setFooter("alias: `l`");
        case "set":
            return embed
            .setTitle("Settings")
            .setDescription("This command changes your settings.")
            .addField(
                "__nimi ni li seme?__ `n`",
                `\`${prefix}set nnls ale\` ` + 
                `switch dictionary to all proper names mentioned in the Book (default)\n` + 
                `\`${prefix}set nnls ma\` switch dictionary to place names only\n` + 
                `\`${prefix}set nnls toki\` switch dictionary to language names only`
            )
            .addField(
                "__alasa sitelen__ `a`",
                `\`${prefix}set als pu\` switch dictionary to the Book (default)\n` + 
                `\`${prefix}set als nap\` switch dictionary to *nimi ale pona* (pu + unofficial)`                
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