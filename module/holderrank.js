const { Table } = require("embed-table");
const {ActionRowBuilder, SelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require('discord.js');

const rankList20 = new Table({
    titles : ['No', 'Holder', 'NFT Count'],
    titleIndexes : [0, 4, 45],
    columnIndexes : [0, 3, 22],
    start : '`',
    end : '`',
    padEnd : 3
});

const rankList40 = new Table({
    titles : ['No', 'Holder', 'NFT Count'],
    titleIndexes : [0, 4, 45],
    columnIndexes : [0, 3, 22],
    start : '`',
    end : '`',
    padEnd : 3
});

const rankList60 = new Table({
    titles : ['No', 'Holder', 'NFT Count'],
    titleIndexes : [0, 4, 45],
    columnIndexes : [0, 3, 22],
    start : '`',
    end : '`',
    padEnd : 3
});

var ranking = [];
var rank = "";
var nftCount = [], nftCountSort = [];

exports.run = function(y){
    var uniHolderList = [...new Set(y)];
    var count = {};
    

    y.forEach(function(i) { count[i] = (count[i] || 0) +1;});
    
    for(nftCountIndex=0; nftCountIndex<uniHolderList.length; nftCountIndex++){
        countIndex=uniHolderList[nftCountIndex];
        nftCount[nftCountIndex] = count[countIndex];
    }

    nftCountSort = nftCount.slice();
    nftCountSort.sort(function(a,b){return b-a;});

    for(nftCountSortIndex = 0; nftCountSortIndex < uniHolderList.length; nftCountSortIndex++){
        for(nftCountIndex = 0; nftCountIndex < uniHolderList.length; nftCountIndex++){
            if(nftCount[nftCountIndex] == nftCountSort[nftCountSortIndex]){
                if(ranking.indexOf(uniHolderList[nftCountIndex]) !== -1){
                    continue;
                }
                else{
                    ranking[nftCountSortIndex] = uniHolderList[nftCountIndex];
                }
            }
        }
    }

    for(rankingIndex=0; rankingIndex<ranking.length; rankingIndex++){
        place = `${rankingIndex+1}. ${ranking[rankingIndex]} - ${nftCountSort[rankingIndex]} ANNA NFT\n`;
        rank = rank + place;        
    }

    var final = holderRankTable(ranking, nftCountSort)

    return final
    console.log(rank)
}

function holderRankTable(holderlist, nftlist){
    for(index=0; index<20; index++){
        rankList20.addRow([`${index+1}.`, `${holderlist[index]}`, `${nftlist[index]}`])
    }

    for(index=20; index<40; index++){
        rankList40.addRow([`${index+1}.`, `${holderlist[index]}`, `${nftlist[index]}`])
    }

    for(index=40; index<holderlist.length; index++){
        rankList60.addRow([`${index+1}.`, `${holderlist[index]}`, `${nftlist[index]}`])
    }

    var rankListEmbed20 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Holder Rank')
                            .setDescription('Holder ranking based on NFT count')
					        .setFields(rankList20.toField());
    
    var rankListEmbed40 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Holder Rank')
                            .setDescription('Holder ranking based on NFT count')
					        .setFields(rankList40.toField());

    var rankListEmbed60 = new EmbedBuilder()
                            .setColor('#0099ff')
                            .setTitle('Holder Rank')
                            .setDescription('Holder ranking based on NFT count')
					        .setFields(rankList60.toField());
    
    const pages = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('holder1to20')
                                .setLabel('1-20')
                                .setStyle(ButtonStyle.Primary)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('holder21to40')
                                .setLabel('21-40')
                                .setStyle(ButtonStyle.Primary)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId('holder41to60')
                                .setLabel('41-60')
                                .setStyle(ButtonStyle.Primary)
                            )
    
    console.log('holder rank')
    var rankList = [rankListEmbed20, rankListEmbed40, rankListEmbed60]
    var final = [rankList, pages]
    return final
}