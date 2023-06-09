const Discord = require("discord.js"); // This variable is the access to Discord API
const { Table } = require("embed-table");
const {ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const fs = require('node:fs');
const { clientID, guildID, tokenID } = require("./config.json");

// Creating a new client from Discord API with intent and partials
const client = new Discord.Client({ intents : [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages, Discord.IntentsBitField.Flags.DirectMessages], 
    partials : ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER"]});

// notify when bot is  online
client.on("ready", () => {
    console.log(client.user.tag + " is now online.");
});

var holderList = JSON.parse(fs.readFileSync("./data/holder.json"));
var detailsList = JSON.parse(fs.readFileSync("./data/detail.json"));
var rarityList = JSON.parse(fs.readFileSync("./data/raritycount.json"));

//var scrap = require('./module/scrap');
var holderRank = require('./module/holderrank');
var rarityRank = require('./module/rarityrank');
var scrap = require('./module/scrap');
var sales = require('./module/sales.js');
var list = require('./module/list.js');
var floor = require('./module/floor.js');

var holder = [];
var username = [];
var anna = 85;

async function checktime(){
    var today = new Date();
    var time = today.getHours();
    console.log(time);
    if(time == 16){
        //rarityRank.create(holderList, detailsList);
        var nftCount = await checkNFTCount();
        scrap.run(1, nftCount);
        setTimeout(checktime, 3600000);
    }
    else{
        setTimeout(checktime, 1000);
    }
}
checktime();

async function checkNFTCount(){
    var api = `https://api.opensea.io/collection/projectanna/stats`;
    const raw = await fetch(api);
    var data = await raw.json();
    var count = parseInt(data.stats.count);
    console.log(count);
    return count;
}

function update(){
    sales.run();
    setTimeout(list.run, 500);
    //list.run();
}
update();
setInterval(update, 90000);

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const {commandName} = interaction;

    if(commandName == 'holderrank'){
        reply = holderRank.run(holderList);
        interaction.reply({ embeds : [reply[0][0]], components : [reply[1]]});
    }
    else if(commandName == 'rarityrank'){
        reply = rarityRank.run();
        interaction.reply({ embeds : [reply[0][0]], components : [reply[1]]});
    }
    else if(commandName == 'floor'){
        //console.log(interaction.memberPermissions.toArray());
        reply = floor.run();
        if(reply == 0){
            interaction.reply('We got no listing in the moment. LLA!');
        }
        else{
            replyembed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${reply.name} is listed for ${reply.price} ETH`).setURL(`${reply.link}`)
                .addFields(
                   {name : `${reply.name}`, value : `${reply.desc}`}
                )
                .setImage(reply.image);

        	interaction.reply({embeds : [replyembed]});
        }
    }
    else if(commandName == 'test'){
        console.log(interaction.channel.permissionsFor(client.user).has(['SendMessages', 'ViewChannel']));
        interaction.reply('test');
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isButton()) return;

    var buttonName = interaction.customId;

    if(buttonName == "holder1to20"){
        reply = holderRank.run(holderList);
        interaction.update({ embeds : [reply[0][0]], components : [reply[1]]});
    }
    else if(buttonName == "holder21to40"){
        reply = holderRank.run(holderList);
        interaction.update({ embeds : [reply[0][1]], components : [reply[1]]});
    }
    else if(buttonName == "holder41to60"){
        reply = holderRank.run(holderList);
        interaction.update({ embeds : [reply[0][2]], components : [reply[1]]});
    }
    else if(buttonName == "rarity1to20"){
        reply = rarityRank.run();
        interaction.update({ embeds : [reply[0][0]], components : [reply[1]]});
    }
    else if(buttonName == "rarity21to40"){
        reply = rarityRank.run();
        interaction.update({ embeds : [reply[0][1]], components : [reply[1]]});
    }
    else if(buttonName == "rarity41to60"){
        reply = rarityRank.run();
        interaction.update({ embeds : [reply[0][2]], components : [reply[1]]});
    }

});


client.login(tokenID); // login bot with its token