var ctx = document.getElementById('myChart').getContext('2d')
let rawData = {}
let dataSpot = {
    labels: [],
    datasets: [{
        label: 'Av Price',
        data: [],
        borderWidth: 1
    }]
}

var option = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    },
	showLines: true,
    onClick: function(evt) {   
    var element = myChart.getElementAtEvent(evt);
    if(element.length > 0)
    {
      var ind = element[0]._index;
      printDayInfo(dataSpot.labels[ind])
      }
    }
}

var myChart = new Chart(ctx, {
    type: 'line',
    data: dataSpot,
    options: option
})

axios.get('https://gameboy-price-logger.herokuapp.com/')
.then(function(response){
    rawData = response.data
    sortData(response.data)
})

function sortData(data){
    data.sort(function (a, b) {
        if (a.date > b.date) return 1
        if (a.date < b.date) return -1
        return 0;
    })
    let currentDate = 0
    let currentCount = 0
    let currentTotal = 0
    let days= []
    let avs= []
    for(let i=0;i<data.length;i++){
        if(currentDate != data[i].date.split("T")[0]){
            if(currentCount != 0){
                avs.push((currentTotal / currentCount).toFixed(2))
            }
            days.push(data[i].date.split("T")[0])
            currentDate = data[i].date.split("T")[0]
            currentTotal = parseFloat(data[i].price)
            currentCount = 1
        }
        else{
            currentTotal += parseFloat(data[i].price)
            currentCount++
        }
    }
    if(currentCount != 0){
        avs.push((currentTotal / currentCount).toFixed(2))
    }
    createChart(days, avs)
}

function createChart(days,avs){
    dataSpot.labels = days
    dataSpot.datasets[0].data = avs
    myChart.update()
}

function printDayInfo(date){
    infoDiv = document.getElementById("moreInfo")
    infoDiv.innerHTML = ""
    infoDiv.innerHTML += `<h3>${date}</h3>`
    for(let i=0;i<rawData.length;i++){
        if(rawData[i].date.split("T")[0] == date){
            let dataHere = rawData[i]
            infoDiv.innerHTML += `<div class="row">`
            infoDiv.innerHTML += `<span class="title"><a href="${dataHere.url}">${dataHere.title}</a></span>`
            infoDiv.innerHTML += `<span class="price">${dataHere.price}</span>`
            infoDiv.innerHTML += `</div>`
        }
    }
}