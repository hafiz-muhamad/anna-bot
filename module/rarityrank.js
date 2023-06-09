const { Table } = require("embed-table");
const {ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');
const fs = require('node:fs');

const rankList20 = new Table({
    titles : ['No', 'Holder', 'L', 'E', 'R', 'C'],
    titleIndexes : [0, 4, 45, 48, 52, 55],
    columnIndexes : [0, 3, 22, 24, 26, 28],
    start : '`',
    end : '`',
    padEnd : 3
});

const rankList40 = new Table({
    titles : ['No', 'Holder', 'L', 'E', 'R', 'C'],
    titleIndexes : [0, 4, 45, 48, 52, 55],
    columnIndexes : [0, 3, 22, 24, 26, 28],
    start : '`',
    end : '`',
    padEnd : 3
});

const rankList60 = new Table({
    titles : ['No', 'Holder', 'L', 'E', 'R', 'C'],
    titleIndexes : [0, 4, 45, 48, 52, 55],
    columnIndexes : [0, 3, 22, 24, 26, 28],
    start : '`',
    end : '`',
    padEnd : 3
});

exports.create = function(b1, b2){
    //var rarityList = JSON.parse(fs.readFileSync("./data/raritycount.json"));
    var uniHolderList = [...new Set(b1)];

    rarity = {};
    rare = [];
    for(index=0; index<uniHolderList.length; index++){
        rarity.username = uniHolderList[index];
        rarity.common = 0;
        rarity.rare = 0;
        rarity.epic = 0;
        rarity.legendary = 0;

        rare.push(JSON.parse(JSON.stringify(rarity)));
    }

    fs.writeFileSync("./data/raritycount.json", JSON.stringify(rare, null, 1));
    console.log('rarity count reset')
    raritycount(b2, uniHolderList);
};

//checkrarity(holderList)

function raritycount(z0, z1){
    var rarityList = JSON.parse(fs.readFileSync("./data/raritycount.json"));

    for(index = 0; index < z0.length; index++){
        rarecheckUsername = z0[index].username;
        rarecheckRarity = z0[index].rarity;

        usernameIndex = z1.indexOf(rarecheckUsername);

        if(rarecheckRarity=="COMMON"){
            rarityList[usernameIndex].common += 1;
        }
        else if(rarecheckRarity=="RARE" || rarecheckRarity=="RARE (LIMITED EDITION)" || rarecheckRarity=="RARE (SPECIAL EDITION)"){
            rarityList[usernameIndex].rare += 1;
        }
        else if(rarecheckRarity=="EPIC"){
            rarityList[usernameIndex].epic += 1;
        }
        else if(rarecheckRarity=="LEGENDARY" || rarecheckRarity=="LEGENDARY (SPECIAL EDITION)"){
            rarityList[usernameIndex].legendary += 1;
        }
        console.log(index);
    }
	
    console.log('count check done');
    fs.writeFileSync("./data/raritycount.json", JSON.stringify(rarityList, null, 1));
}

exports.run = function(){
    legendHolder = [], legendHolderSort = []
    epicHolder = [], epicHolderSort = []
    rareHolder = [], rareHolderSort = []
    commonHolder = [], commonHolderSort = []

    var holderList = JSON.parse(fs.readFileSync("./data/holder.json"));
    var rarityList = JSON.parse(fs.readFileSync("./data/raritycount.json"));
    var uniHolderList = [...new Set(holderList)];
    var ranking = []

    for(index=0; index<uniHolderList.length; index++){
        if(rarityList[index].legendary != 0){
            legendHolder.push(JSON.parse(JSON.stringify(rarityList[index].username)));
        }
        else{
            if(rarityList[index].epic != 0){
                epicHolder.push(JSON.parse(JSON.stringify(rarityList[index].username)));
            }
            else{
                if(rarityList[index].rare != 0){
                    rareHolder.push(JSON.parse(JSON.stringify(rarityList[index].username)));
                }
                else{
                    commonHolder.push(JSON.parse(JSON.stringify(rarityList[index].username)));
                }
            }
        }
    }

    legendHolderSort = sortRarity(rarityList, legendHolder, uniHolderList)
    epicHolderSort = sortRarity(rarityList, epicHolder, uniHolderList)
    rareHolderSort = sortRarity(rarityList, rareHolder, uniHolderList)
    commonHolderSort = sortRarity(rarityList, commonHolder, uniHolderList)

    var rankSeq = [legendHolderSort, epicHolderSort, rareHolderSort, commonHolderSort]

    for(index=0; index<rankSeq.length; index++){
        ranking = ranking.concat(rankSeq[index])
    }

    /*
    for(rankingIndex=0; rankingIndex<ranking.length; rankingIndex++){
        usernameIndex = uniHolderList.indexOf(ranking[rankingIndex])
        place = `${rankingIndex+1}. ${ranking[rankingIndex]} - ${rarityList[usernameIndex].legendary} Legendary ${rarityList[usernameIndex].epic} Epic ${rarityList[usernameIndex].rare} Rare ${rarityList[usernameIndex].common} Common\n`;
        rank = rank + place;        
    }
    */
    var final = rarityRankTable(ranking, rarityList, uniHolderList)
    return final
}

//rarityrank(holderList)

function sortRarity(c0, c1, c2){
    var count = [], countSort = [];
    var ranking = []

    for(index=0; index<c1.length; index++){
        usernameIndex = c2.indexOf(c1[index])
        legendCount = c0[usernameIndex].legendary
        epicCount = c0[usernameIndex].epic
        rareCount = c0[usernameIndex].rare
        commonCount = c0[usernameIndex].common

        if(c1 == legendHolder){
            count[index] = legendCount * 1000
            if(epicCount != 0){
                count[index] += (epicCount * 100)
            }

            if(rareCount != 0){
                count[index] += (rareCount * 10)
            }

            if(commonCount != 0){
                count[index] += (commonCount * 1)
            }
        }
        else if(c1 == epicHolder){
            count[index] = epicCount * 100

            if(rareCount != 0){
                count[index] += (rareCount * 10)
            }

            if(commonCount != 0){
                count[index] += (commonCount * 1)
            }
        }
        else if(c1 == rareHolder){
            count[index] = rareCount * 10

            if(commonCount != 0){
                count[index] += (commonCount * 1)
            }
        }
        else if(c1 == commonHolder){
            count[index] = commonCount
        }
    }

    countSort = count.slice()
    countSort.sort(function(a,b){return b-a;});
    
    for(countSortIndex = 0; countSortIndex < countSort.length; countSortIndex++){
        for(countIndex = 0; countIndex < count.length; countIndex++){
            if(count[countIndex] == countSort[countSortIndex]){
                if(ranking.indexOf(c1[countIndex]) !== -1){
                    continue;
                }
                else{
                    ranking[countSortIndex] = c1[countIndex];
                }
            }
        }
    }
    
    return ranking
}

function rarityRankTable(ranking, rarityList, uniHolderList){
    
    for(index=0; index<20; index++){
        usernameIndex = uniHolderList.indexOf(ranking[index])
        rankList20.addRow([`${index+1}.`, `${ranking[index]}`, `${rarityList[usernameIndex].legendary}`, `${rarityList[usernameIndex].epic}`, `${rarityList[usernameIndex].rare}`, `${rarityList[usernameIndex].common}`])
    }

    for(index=20; index<40; index++){
        usernameIndex = uniHolderList.indexOf(ranking[index])
        rankList40.addRow([`${index+1}.`, `${ranking[index]}`, `${rarityList[usernameIndex].legendary}`, `${rarityList[usernameIndex].epic}`, `${rarityList[usernameIndex].rare}`, `${rarityList[usernameIndex].common}`])
    }

    for(index=40; index<ranking.length; index++){
        usernameIndex = uniHolderList.indexOf(ranking[index])
        rankList60.addRow([`${index+1}.`, `${ranking[index]}`, `${rarityList[usernameIndex].legendary}`, `${rarityList[usernameIndex].epic}`, `${rarityList[usernameIndex].rare}`, `${rarityList[usernameIndex].common}`])
    }

    var rankListEmbed20 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Rarity Rank')
                            .setDescription('Holder ranking based on rarity')
					        .setFields(rankList20.toField());
    
    var rankListEmbed40 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Rarity Rank')
                            .setDescription('Holder ranking based on rarity')
					        .setFields(rankList40.toField());

    var rankListEmbed60 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Rarity Rank')
                            .setDescription('Holder ranking based on rarity')
					        .setFields(rankList60.toField());
    
    const pages = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('rarity1to20')
                                .setLabel('1-20')
                                .setStyle(ButtonStyle.Primary)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('rarity21to40')
                                .setLabel('21-40')
                                .setStyle(ButtonStyle.Primary)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('rarity41to60')
                                .setLabel('41-60')
                                .setStyle(ButtonStyle.Primary)
                            )
    
    console.log('rarity rank')
    var rankList = [rankListEmbed20, rankListEmbed40, rankListEmbed60]
    var final = [rankList, pages]
    return final
}