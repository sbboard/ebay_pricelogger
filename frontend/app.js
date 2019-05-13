var ctx = document.getElementById('myChart').getContext('2d')
axios.get('https://gameboy-price-logger.herokuapp.com/')
.then(function(response){
    sortData(response.data)
})

function sortData(data){
    data.sort(function (a, b) {
        if (a.date > b.date) return 1;
        if (a.date < b.date) return -1;
        return 0;
      });
    console.log(data)
    let currentDate = 0
    let currentCount = 0
    let currentTotal = 0
    let days= []
    let avs= []
    for(let i=0;i<data.length;i++){
        if(currentDate != data[i].date.split("T")[0]){
            if(currentCount != 0){
                avs.push(currentTotal / currentCount)
            }
            days.push(data[i].date.split("T")[0])
            currentDate = data[i].date.split("T")[0]
            currentTotal = 0
            currentCount = 0
        }
        else{
            currentTotal += parseFloat(data[i].price)
            currentCount++
        }
    }
    if(currentCount != 0){
        avs.push(currentTotal / currentCount)
    }
    console.log(days, avs)
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