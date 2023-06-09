const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST, RESTEvents } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client } = require("discord.js");
const { clientID, guildID, tokenID } = require("./config.json");

const commands = [
    new SlashCommandBuilder().setName('test').setDescription('test'),
    new SlashCommandBuilder().setName('floor').setDescription('Show the cheapest listing'),
    new SlashCommandBuilder().setName('holderrank').setDescription('Holder rank based on NFT count'),
    new SlashCommandBuilder().setName('rarityrank').setDescription('Holder rank based on rarity')
]
.map(commands => commands.toJSON());

const rest = new REST({version: '9'}).setToken(tokenID);
(async() => {
    try {
        console.log('load command jap eh');
        await rest.put(Routes.applicationCommands(clientID, guildID), {body : commands});
        console.log('okay command ready');
    }
    catch(error){
        console.error(error);
    }

    
})();