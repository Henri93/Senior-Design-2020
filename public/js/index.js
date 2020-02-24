/* global $ */
// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';


$(document).ready(function() {
  var socket = io.connect('http://localhost:3000');

  /*------SOCKET EVENTS*------*/
  socket.on('hub_connect', (data) =>{
    var curPumps = parseInt($('#totalPumpNum').html())
    $('#totalPumpNum').html(curPumps + data['pumps'].length)
  });

  socket.on('hub_disconnect', (data) =>{
    var curPumps = parseInt($('#totalPumpNum').html())
    $('#totalPumpNum').html(curPumps - data['pumps'].length)
  });

  var pumps = []
  var completedOrders = []
  var openPumps = 0
  var runningPumps = 0

  // kick off getting the pumps
  getPumps()
  loadPumpUtlizationChart()
  getCompleteOrders()
  
  function getPumps() {
    $.ajax({
      url: '/api/pumps',
      type: 'GET',
      success: function(res) {
        pumps = res
        console.log(pumps)
        $('#totalPumpNum').html(pumps.length)
      },
    })
  }

  function getCompleteOrders() {
    $.ajax({
      url: '/api/completedOrders',
      type: 'GET',
      success: function(res) {
        completedOrders = res
        $('#totalCompletedOrders').html(completedOrders.length)
      },
    })
  }

  function loadPumpUtlizationChart() {
    //assume pumps are now locally saved
    for(var i = 0; i < pumps.length; i++){
      if(pumps[i].isRunning){
        runningPumps++;
      }else{
        openPumps++;
      }
    }

    var ctx = document.getElementById("myPieChart");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Working", "Stopped"],
        datasets: [{
          data: [openPumps, runningPumps],
          backgroundColor: ['#1cc88a', '#858796'],
          hoverBackgroundColor: ['#17a673', '#858796'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });
  }
})