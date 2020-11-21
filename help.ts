import { MessageEmbed } from "discord.js";
import { prefix as p } from "./bot_config.json";

export function help(input: string): MessageEmbed {
    const embed = new MessageEmbed()
    .setColor(0x7289da);
    if (!input.length) {
        return embed
        .setTitle("Help")
        .setDescription(
            "toki! You can play word games in toki pona with me. " + 
            `Here is the list of my games and commands. ` + 
            `Type \`${p}help [command]\` to get more information. musi pona!`
        )
        .addField(
            "`;nnls` __NIMI NI LI SEME?__ (guess the word)",
            "Guess a place or language name in toki pona. " + 
            `(\`${p}help nnls\` for more info)`
        )
        .addField(
            "`;als`   __ALASA SITELEN__ (hangman)",
            "Guess a toki pona word letter by letter. " +
            `(\`${p}help als\` for more info)`
        )
        .addField(
            "`;ln`     __LINJA NIMI__ (word chain)",
            "We make a chain out of words, where each next word starts with a letter in the last word's syllable. " + 
            `(\`${p}help ln\` for more info)`
        )
        .addField(
            "Other commands",
            `\`${p}stats\` show statictics\n` + 
            `\`${p}@\` toggle mentions\n` + 
            `\`${p}credits\` authors & github link`
        )
    }
    else switch (input) {
        case "nnls":
            return embed
            .setTitle("nimi ni li seme? (guess the name)")
            .setDescription(
                "Guess a place or language name in toki pona. Try to get a long streak!\n"
            )
            .addField(
                "How to play",
                `\`${p}nnls\` guess a new name (or last one, if there is)\n` + 
                `\`${p}[...]\` make your guess and play again\n` + 
                `\`${p}\` skip guess and play again\n\n` + 
                `\`${p}-[...]\` make your guess and stop\n` + 
                `\`${p}-\` skip guess and stop`
            )
            .addField(
                "Settings",
                `\`${p}nnls ale\` ` + 
                `switch dictionary to all proper names mentioned in the Book (default)\n` + 
                `\`${p}nnls ma\` switch dictionary to place names only\n` + 
                `\`${p}nnls toki\` switch dictionary to language names only`
            );
        case "als":
            return embed
            .setTitle("alasa sitelen (hangman)")
            .setDescription(
                "Guess a toki pona word letter by letter. " + 
                "If your letter occurs many times within the word, only one is shown. " + 
                "You can make only 5 mistakes. At least, no one will be hanged in the end...\n"
            )
            .addField(
                "How to play",
                `\`${p}als\` start a new game (or continue the last one, if there is)\n` + 
                `\`${p}[letter]\` make your guess\n` + 
                `\`${p}[word]\` guess the whole word (finishes the game)`
            )
            .addField(
                "Settings",
                `\`${p}als pu\` switch dictionary to the Book (default)\n` + 
                `\`${p}als nimi ale pona\` switch dictionary to *nimi ale pona* (pu + unofficial)`
            );
        case "ln":
            return embed
            .setTitle("linja nimi (word chain)")
            .setDescription(
                "We play against each other. " + 
                "You say the first word, and " + 
                "every next word must start with a letter in the last word’s syllable " + 
                "(e. g. suno -> olin -> laso -> sike etc.). No word can be repeated within a game. " + 
                "You win if your opponent has no words to continue the chain. " + 
                "Be aware, I am not spitting random words. Beat me if you can!\n"
            )
            .addField(
                "How to play",
                `\`${p}ln\` or \`${p}ln [word]\` start a new game (or continue the last one, if there is)\n` + 
                `\`${p}[word]\` make your turn\n` + 
                `\`${p}hint\` show all of your options\n` + 
                `\`${p}cancel\` cancel the game (counts as loosing)`
            );
        case "stats":
            return embed
            .setTitle("Statistics")
            .setDescription(`\`${p}stats\` shows your scores in the games.`);
        case "@":
            return embed
            .setTitle("Mentions")
            .setDescription(
                `\`${p}@\` toggles, whether to mention you in the replies or not ` + 
                "(turned off by default)"
            );
        case "credits":
            return embed
            .setTitle("Credits")
            .setDescription(
                "<@464904025469616134> made this bot\n" + 
                "<@586692123642822676> suggetions and testing\n" + 
                "<@385920914472304663> initial idea\n" + 
                "link for [GitHub repo](https://github.com/Qubix27/ilo_musi)"
            )
    }
}