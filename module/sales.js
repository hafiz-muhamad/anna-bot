const Discord = require("discord.js"); // This variable is the access to Discord API
//const fetch = require('node-fetch');
const fs = require("fs");
const {EmbedBuilder} = require('discord.js');
const { clientID, guildID, tokenID, apiKey } = require("./config.json");

// Creating a new client from Discord API with intent and partials
const client = new Discord.Client({ intents : [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages, Discord.IntentsBitField.Flags.DirectMessages], 
    partials : ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER"]});

exports.run = async function(){
    saledetails = {};
    saledetail = [];
    var event = [];
    var saleapi = `https://api.opensea.io/api/v1/events/?asset_contract_address=0x59533EE8D12877C4DA0b036c588cD8Fae45314c0&event_type=successful`;
    let saleprop = {
        headers : {
            'x-api-key' : apiKey
        }
    };
    const saleraw = await fetch(saleapi, saleprop);
    const saledata = await saleraw.json();
    event = await saledata.asset_events;
    console.log(event);
    for(eventIndex = 0; eventIndex < event.length; eventIndex++){
        saledetails.sale_id = event[eventIndex].transaction.id;
        saledetails.type = event[eventIndex].event_type;
        saledetails.id = event[eventIndex].asset.token_id;
        saledetails.name = event[eventIndex].asset.name;
        saledetails.desc = event[eventIndex].asset.description;
        saledetails.from_account = event[eventIndex].seller.user.username;
        saledetails.from_address = event[eventIndex].seller.address;
        saledetails.to_account = event[eventIndex].winner_account.user.username;
        saledetails.to_address = event[eventIndex].winner_account.address;
        saledetails.price = event[eventIndex].total_price / 1000000000000000000;
        saledetails.link = event[eventIndex].asset.permalink;
        saledetails.image = event[eventIndex].asset.image_url;

        saledetail.push(JSON.parse(JSON.stringify(saledetails)));
    }
	
    console.log('sale scrap done');
    fs.writeFileSync("./data/sale1.json", JSON.stringify(saledetail, null, 1));
    checksale();
};

function checksale(){
    var newsale = JSON.parse(fs.readFileSync("./data/sale1.json"));
    var newsaleId = newsale.map(a => a.sale_id);

    var oldsale = JSON.parse(fs.readFileSync("./data/sale2.json"));
    var oldsaleId = oldsale.map(a => a.sale_id);

    for(index = 0; index < newsaleId.length; index++){
        if(oldsaleId.indexOf(newsaleId[index]) == -1){
            target = '1106579028959309854';
            target2 = '1106408242545950820';
            setTimeout(printsale, 5000, newsale[index], target);
            setTimeout(printsale, 5000, newsale[index], target2);
        }
    }

    fs.writeFileSync("./data/sale2.json", JSON.stringify(saledetail, null, 1));
}

function printsale(sale, targetchannel){
    saleembed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${sale.name} SOLD!`).setURL(`${sale.link}`)
                .addFields(
                    {name : `Purchased by ${sale.to_account} for ${sale.price} ETH`, value : `\u200b`}
                )
                .addFields(
                   {name : `${sale.name}`, value : `${sale.desc}`}
                )
                .setImage(sale.image);
            

    var sendnoti = client.channels.fetch(targetchannel);
    sendnoti.then(channel => channel.send({embeds : [saleembed]})).catch(console.error);
}

client.login(tokenID); // login bot with its token