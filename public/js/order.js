Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
var firstTime;
var ctx;
var myPieChart;
var interval;

$(function(){
	//var socket = io.connect('http://10.103.126.250:3000/order');
	var socket = io.connect('http://10.103.117.106:3000');

	/*------SOCKET EVENTS*------*/
	socket.on('order_data', (data) =>{
		//got the data update the charts
		displayOrderData(data);
	});

	// var count = 0;
	// interval = setInterval(function() {
 //   		// method to be executed;
 //   		sendOrderData(socket, count);
 //   		count++;
 // 	}, 3000);

 	ctx = document.getElementById("myPieChart");
	myPieChart = new Chart(ctx, {
	  type: 'doughnut',
	  data: {
	    labels: ["Complete", "Incomplete"],
	    datasets: [{
	      data: [0, 100],
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

	$("form").submit(function(e){
        e.preventDefault();
    });

	$("#inputCommandBtn").click(function() {
		var command = $("#inputCommand").val();
		var parts = command.split("(");
		if(parts[0] === "run_finite_with_accel"){
			var parts2 = parts[1].split(")");
			var args = parts2[0].split(",");
			socket.emit('send_command_finite_accel', {timestamp: Date.now(), command: command, args: args});
		}
	});

	$("#runOrderBtn").click(function() {
		alert("Running order");
	});
});

function displayOrderData(data){

	//TIME
	var time = data.timestamp;
	var elapsedTime = 0;
	if(firstTime == null || time < firstTime){
		firstTime = time;
	}
	elapsedTime = Math.round((time - firstTime) / 1000);
	$('#timeElapsed').html(elapsedTime + "s");


	//INGREDIENTS
	var ingredients = data.ingredients;
	$.each(ingredients, function( key, value ) {
  		var amountDispensed = value["amountDispensed"];
  		var precentDispensed = (value["precentDispensed"] * 100);
  		if(precentDispensed >= 100){
  			precentDispensed = 100;
  		}

  		if(key == "CitricAcid"){
  			$('#'+key+'Header').html(amountDispensed + "ML of 7ML");
  		}else if(key == "IvyExtract"){
  			$('#'+key+'Header').html(amountDispensed + "ML of 17ML");
  		}else{
  			$('#'+key+'Header').html(amountDispensed + "ML of 22ML");
  		}
  		
  		$('#'+key).css("width", precentDispensed + "%");
	});



	//PERCENT CHART
	var percentComplete = data.percentComplete;
	if(percentComplete >= 100){
		percentComplete = 100;
	}
	updateData(myPieChart, "Complete", percentComplete);
	updateData(myPieChart, "Incomplete", 100-percentComplete);

}

function updateData(chart, label, data) { 
    chart.data.datasets.forEach((dataset) => {
    	if(label == "Complete"){
    		dataset.data[0] = data;
    	}else{
    		dataset.data[1] = data;
    	}
    });
    chart.update();
}

function sendOrderData(socket, count){
	var amountDispensed1 = 7;
	var amountDispensed2 = 17;
	var amountDispensed3 = 22;

	
	if(count == 0){
		amountDispensed1 = 1;
		amountDispensed2 = 0;
		amountDispensed3 = 0;
	}else if(count == 1){
		amountDispensed1 = 4.5;
		amountDispensed2 = 0;
		amountDispensed3 = 0;
	}else if(count == 2){
		amountDispensed2 = 6.5;
		amountDispensed3 = 0;
	}else if(count == 3){
		amountDispensed2 = 13.3;
		amountDispensed3 = 0;
	}else if(count == 4){
		amountDispensed3 = 2;
	}else if(count == 5){
		amountDispensed3 = 14;
	}else if(count == 6){
		amountDispensed3 = 20.6;
	}

	let percentComplete = Math.round((amountDispensed1+amountDispensed2+amountDispensed3)/(7+17+22) * 100);

	var ingredient1 = Object();
	ingredient1.amountDispensed = amountDispensed1;
	ingredient1.precentDispensed = amountDispensed1/7;

	var ingredient2 = Object();
	ingredient2.amountDispensed = amountDispensed2;
	ingredient2.precentDispensed = amountDispensed2/17;

	var ingredient3 = Object();
	ingredient3.amountDispensed = amountDispensed3;
	ingredient3.precentDispensed = amountDispensed3/22;

	var ingredients = Object();
	ingredients.CitricAcid = ingredient1;
	ingredients.IvyExtract = ingredient2;
	ingredients.AcaiOil = ingredient3;

	socket.emit('order_data', {timestamp: Date.now(), percentComplete: percentComplete, ingredients});

	if(percentComplete >= 100){
		clearInterval(interval);
	}
}