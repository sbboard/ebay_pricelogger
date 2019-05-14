var ctx = document.getElementById('myChart').getContext('2d')
axios.get('https://gameboy-price-logger.herokuapp.com/')
.then(function(response){
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
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: 'Av Price',
                data: avs,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    })
}