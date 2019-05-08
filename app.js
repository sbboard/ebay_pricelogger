const axios = require('axios')
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));
var date = new Date();
let yesterday = date.setDate(date.getDate() - 1);

const apiURL = "http://svcs.ebay.com/services/search/FindingService/v1?"+
"OPERATION-NAME=findCompletedItems"+
"&SECURITY-APPNAME="+config.client_id+
"&RESPONSE-DATA-FORMAT=JSON"+
"&keywords=Gameboy"+
//"&categoryId=156955"+
"&itemFilter(0).name=Condition"+
"&itemFilter(0).value=3000"+
"&itemFilter(1).name=FreeShippingOnly"+
"&itemFilter(1).value=true"+
"&itemFilter(2).name=SoldItemsOnly"+
"&itemFilter(2).value=true"+
"&sortOrder=PricePlusShippingLowest"

axios.get(apiURL)
  .then(function (response) {
    console.log(response.data.findCompletedItemsResponse[0].searchResult[0].item);
  })
//   .catch(function (error) {
//     console.log(error);
//   });

// setInterval(()=> {
//     let today = new Date()
//     if(today.getHours() == admin.timeToSend || admin.dayOverride == true){
//         ebay.findCompletedItems("\"gameboy color\" \"for parts\"")
//         .then((data) => {
//             console.log(data)
//         })
//         .then(()=>{
//             //theBoys.sort(({cost:a}, {cost:b}) => a-b);
//         })
//     }
// }, admin.interval);