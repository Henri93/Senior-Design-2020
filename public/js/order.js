var order;

/* global $ */
$(document).ready(function() {
	var totalDispensed = 0
	var totalAmount = 0
	var orderId = $('#orderId').html();
  
  	getOrder()
  
	function getOrder() {
	  $.ajax({
	    url: '/api/order',
	    type: 'GET',
	    data: { 
		    orderId: orderId
		},
	    success: function(res) {
	      order = res[0];

	      if(order.complete){
	      	$("#runOrderBtn").removeClass('btn-success').addClass('btn-danger')
			$("#runOrderBtn").html("Complete")
	      }

	      $.each(res[0].ingredients, function( key, value ) {
            var ingredientAmount = JSON.parse(value)
            totalDispensed += ingredientAmount.dispensed
            totalAmount += ingredientAmount.total
            var percent = (ingredientAmount.dispensed/ingredientAmount.total)*100
            var ingred = 
            "<h4 class='small font-weight-bold'>"+key+"<span id='CitricAcidHeader' class='float-right'>"+ingredientAmount.dispensed+"ML of "+ingredientAmount.total+"ML</span></h4>"+
            "<div class='progress mb-4'><div class='progress-bar' role='progressbar' style='width: "+percent+"%'' aria-valuenow='"+percent+"' aria-valuemin='0' aria-valuemax='100' id="+key+"></div></div>";

            $('#ingredientsContainer').append(ingred)
          });

          //populate progress chart
          ctx = document.getElementById("myPieChart");
			myPieChart = new Chart(ctx, {
			  type: 'doughnut',
			  data: {
			    labels: ["Complete", "Incomplete"],
			    datasets: [{
			      data: [(totalDispensed/totalAmount)*100, 100-(totalDispensed/totalAmount)*100],
			      backgroundColor: ['#FDA7DF', '#858796'],
			      hoverBackgroundColor: ['#FDA7DF', '#858796'],
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
	    },
	  })
	}

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
		if(!order.complete && $("#runOrderBtn").html().includes('Run Order')){
			//attempt to start the order on a available pump
			$.ajax({
		      url: '/api/openPumps',
		      type: 'GET',
		      success: function(res) {
		        if(res.length > 0 && res[0] !== 'undefined'){
		        	//pump available for order to run
		        	//if success then change button to running
		        	var pumpPort = res[0].port
					$("#runOrderBtn").removeClass('btn-success').addClass('btn-warning')
					$("#runOrderBtn").html("Running")

					//TODO update pump to running

					//run order
					socket.emit('run_order', {timestamp: Date.now(), pump: pumpPort, order: order});
		        }else{
		        	//no open pumps
		        	//if success then change button to running
					alert("No pumps connected and ready!")
		        }
		      },
		    })
		}
	});
});