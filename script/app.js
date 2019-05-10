const axios = require('axios')
const mongoose = require('mongoose')
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));
const gameboyModel = require('./model/gameboy.model')
const admin = {
  interval: 24*60*60*1000
}

setInterval(()=> {
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
  .then(function(){
    //connect to mongoDB
    const dev_db_url = `mongodb+srv://buffum:${config.mondo_secret}@cluster0-thkhg.mongodb.net/test`
    const mongoDB = process.env.MONGODB_URI || dev_db_url
    mongoose.connect(mongoDB, {useNewUrlParser: true})
    mongoose.Promise = global.Promise
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'MongoDB connection error:'))

    for(let x = 0;x<gameboysOfToday.length;x++){
      let thisOldBoy = new gameboyModel({
        title: gameboysOfToday[x].title,
        price: gameboysOfToday[x].actualPrice,
        url: gameboysOfToday[x].url,
        date: gameboysOfToday[x].dateSale,
      })

      thisOldBoy.save((err) => {
          if (err){
              return next(err)
          }
          console.log('Gameboy posted')
      })
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}, admin.interval);