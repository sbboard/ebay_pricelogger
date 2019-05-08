const Ebay = require('ebay-node-api')
const path = require('path')
const config = require(path.join(__dirname, 'config.js'));
const admin = {
    interval: 5*1000,
    dayOf: 1,
    timeToSend: 15,
    dayOverride: true,
}

let ebay = new Ebay({
    clientID: config.client_id
});

setInterval(()=> {
    let theBoys = []
    let today = new Date()
    if(today.getHours() == admin.timeToSend || admin.dayOverride == true){
        ebay.findCompletedItems("\"gameboy color\" \"for parts\"")
        .then((data) => {
            console.log(data)
        })
        .then(()=>{
            //theBoys.sort(({cost:a}, {cost:b}) => a-b);
        })
    }
}, admin.interval);