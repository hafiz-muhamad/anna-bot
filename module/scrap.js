var holder = []
var username = []
const fs = require('node:fs');

var rarityRank = require('./rarityrank');

exports.run = function(x, y){
    
    scrap(x, parseInt(y))
}

async function scrap(x, y){
    details = {}
    var api = `https://api.opensea.io/asset/0x59533EE8D12877C4DA0b036c588cD8Fae45314c0/${x}`;
    const raw = await fetch(api);
    var data = await raw.json();
    var owner = await data.top_ownerships[0].owner;

    details.id = await data.token_id
    details.name = await data.name;
    details.address = await owner.address;
    details.username = await owner.user;
    if(details.username == null){
        details.username = details.address.slice(0,10)
    }
    else{
        details.username = await owner.user.username;
        if(details.username == null){
        	details.username = details.address.slice(0,10)
    	}
    }
    var trait = await data.traits
    var traitList = trait.map(a => a.trait_type)
    var traitValue = trait.map(a => a.value)
    for(index = 0; index < traitList.length; index++){
        if(traitList[index] == "FORM"){
            details.form = traitValue[index]
        }
        else if(traitList[index] == "PHASE"){
            details.phase = traitValue[index]
        }
        else if(traitList[index] == "STANCE"){
            details.stance = traitValue[index]
        }
        else if(traitList[index] == "RACE"){
            details.race = traitValue[index]
        }
        else if(traitList[index] == "RARITY"){
            details.rarity = traitValue[index]
        }
    }
    

    holder.push(JSON.parse(JSON.stringify(details)));
    username.push(JSON.parse(JSON.stringify(details.username)));
    var uniHolderList = [...new Set(username)];

    fs.writeFileSync("./data/detail.json", JSON.stringify(holder, null, 1));
    fs.writeFileSync("./data/holder.json", JSON.stringify(username, null, 1));
    fs.writeFileSync("./data/uniHolder.json", JSON.stringify(uniHolderList, null, 1));
    console.log(x)
    x++
    if(x <= y){
        scrap(x, y)
    }
    else{
        console.log('fail', x, y)
        var holderList = JSON.parse(fs.readFileSync("./data/holder.json"));
		var detailsList = JSON.parse(fs.readFileSync("./data/detail.json"));
        rarityRank.create(holderList, detailsList)
    }
}