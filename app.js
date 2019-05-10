const axios = require('axios')
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));
let date = new Date();
const today = date.toISOString()
let yesterdayMilli = date.setDate(date.getDate() - 1);
const yesterday = new Date(yesterdayMilli).toISOString()
let gameboysOfToday = []

const apiURL = "http://svcs.ebay.com/services/search/FindingService/v1?"+
"OPERATION-NAME=findCompletedItems"+
"&SECURITY-APPNAME="+config.client_id+
"&RESPONSE-DATA-FORMAT=JSON"+
//`&keywords=%27gameboy color%27 %27for parts%27`+
`&keywords=gameboy color for parts`+
"&categoryId=139971"+
"&itemFilter(0).name=Condition"+
"&itemFilter(0).value=7000"+
"&itemFilter(1).name=SoldItemsOnly"+
"&itemFilter(1).value=true"+
"&itemFilter(2).name=EndTimeFrom"+
"&itemFilter(2).value="+yesterday+
"&itemFilter(3).name=EndTimeTo"+
"&itemFilter(3).value="+today

axios.get(apiURL)
  .then(function (response) {
    if(typeof response.data.findCompletedItemsResponse[0].searchResult != 'undefined'){
      let gameboy = response.data.findCompletedItemsResponse[0].searchResult[0].item
      for(let i=0;i<gameboy.length;i++){
        let thisBoy = {}
        //Title
        thisBoy.title = gameboy[i].title[0]
        //Price
        let price = parseFloat(gameboy[i].sellingStatus[0].convertedCurrentPrice[0].__value__).toFixed(2)
        let shippingCost = 0
        if(typeof gameboy[i].shippingInfo[0].shippingServiceCost != 'undefined'){
            shippingCost = parseFloat(gameboy[i].shippingInfo[0].shippingServiceCost[0].__value__).toFixed(2)
        }
        else{
            shippingCost = "*"
        }
        thisBoy.actualPrice = price + shippingCost
        //URL
        thisBoy.url = gameboy[i].viewItemURL[0]
        //Date
        thisBoy.dateSale = gameboy[i].listingInfo[0].endTime[0]
        if(thisBoy.title.toLowerCase().includes("pocket") || thisBoy.title.toLowerCase().includes("lot")){
          console.log("skip")
        }
        else{
          gameboysOfToday.push(thisBoy)
        }
      }
      console.log(gameboysOfToday)
    }
    if(typeof response.data.findCompletedItemsResponse[0].errorMessage != 'undefined'){
      console.log(response.data.findCompletedItemsResponse[0].errorMessage[0].error[0].message)
    }
  })
  .catch(function (error) {
    console.log(error);
  });

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