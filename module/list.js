const Discord = require("discord.js"); // This variable is the access to Discord API
//const fetch = require('node-fetch');
const fs = require("fs");
const {EmbedBuilder} = require('discord.js');
const { clientID, guildID, tokenID, apiKey } = require("./config.json");

// Creating a new client from Discord API with intent and partials
const client = new Discord.Client({ intents : [Discord.IntentsBitField.Flags.Guilds, Discord.IntentsBitField.Flags.GuildMessages, Discord.IntentsBitField.Flags.DirectMessages], 
    partials : ["MESSAGE", "CHANNEL", "GUILD_MEMBER", "REACTION", "USER"]});

exports.run = async function(){
    listdetails = {}
    listdetail = []
    var list = [];
    var listapi = `https://api.opensea.io/v2/listings/collection/projectanna/all`;
    let listprop = {
        headers : {
            'x-api-key' : apiKey
        }
    };
    const listraw = await fetch(listapi, listprop);
    const listdata = await listraw.json();
    list =  await listdata.listings;
	
    //console.log(list)
    for(listIndex = 0; listIndex < list.length; listIndex++){
        listdetails.list_id = list[listIndex].order_hash
        listdetails.id = list[listIndex].protocol_data.parameters.offer[0].identifierOrCriteria
        listdetails.price = list[listIndex].price.current.value / (10 ** 18)

        var api2 = `https://api.opensea.io/api/v1/asset/0x59533EE8D12877C4DA0b036c588cD8Fae45314c0/${listdetails.id}`;
        let prop2 = {
            headers : {
                'x-api-key' : apiKey
            }
        };
        const raw2 = await fetch(api2, prop2);
        const data2 = await raw2.json();

        listdetails.name = data2.name;
        listdetails.desc = data2.description;
        listdetails.link = data2.permalink;
        listdetails.image = data2.image_url;

        listdetail.push(JSON.parse(JSON.stringify(listdetails)));
    }

	console.log('list scrap done');
    fs.writeFileSync("./data/list1.json", JSON.stringify(listdetail, null, 1));
    checklist();
}

function checklist(){
    var newlist = JSON.parse(fs.readFileSync("./data/list1.json"));
    var newlistId = newlist.map(a => a.list_id)

    var oldlist = JSON.parse(fs.readFileSync("./data/list2.json"));
    var oldlistId = oldlist.map(a => a.list_id)

    for(index = 0; index < newlistId.length; index++){
        if(oldlistId.indexOf(newlistId[index]) == -1){
            //target = '1106579028959309854';
            target = '1107533542243708978';
            target2 = '1106408242545950820';
            //target2 = '1108210403063894016';
            setTimeout(printlist, 5000, newlist[index], target);
            setTimeout(printlist, 5000, newlist[index], target2);
        }
    }

    fs.writeFileSync("./data/list2.json", JSON.stringify(listdetail, null, 1));
}

function printlist(list, targetchannel){
    listembed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`${list.name} is listed for ${list.price} ETH!`).setURL(`${list.link}`)
                .addFields(
                   {name : `${list.name}`, value : `${list.desc}`}
                )
                .setImage(list.image);

    var sendnoti = client.channels.fetch(targetchannel);
    sendnoti.then(channel => channel.send({embeds : [listembed]})).catch(console.error);
}

client.login(tokenID); // login bot with its token