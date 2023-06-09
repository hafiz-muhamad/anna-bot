//const fetch = require('node-fetch');
const fs = require("fs");

exports.run = function(){
    var listing = JSON.parse(fs.readFileSync("./data/list2.json"));
    if(listing == ""){
        return 0;
    }
    else{
        var price = listing.map(a => a.price);
    	var minPrice = Math.min(...price);
   		var index = price.indexOf(minPrice);
	
    	return listing[index];
    }
};
