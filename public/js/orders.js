/* global $ */
$(document).ready(function() {

  var orders = []
  
  getOrders()
  
  function getOrders() {
    $.ajax({
      url: '/api/orders',
      type: 'GET',
      success: function(res) {
        orders = res

        var data = []
        for(var i = 0; i < orders.length; i++){
          var dataInfo = [];
          dataInfo.push("<a href='/orders?orderId="+orders[i].uuid+"'>"+orders[i].uuid+"</a>")
          
          var ingredientsList = ""
          $.each(orders[i].ingredients, function( key, value ) {
            ingredientsList = ingredientsList.concat(key + " " + value + "ML<br/>");
          });
          dataInfo.push(ingredientsList)

          dataInfo.push(orders[i].receivedTime)
          dataInfo.push(orders[i].completedTime)

          data.push(dataInfo);
        }

        $('#dataTable').DataTable( {
        data: data,
        columns: [
            { title: "Order #" },
            { title: "Ingredients" },
            { title: "Received Timestamp" },
            { title: "Processed Timestamp" }
        ]
        } );
      },
    })
  }
  // <tr>
  //   <td><a href="/orders?orderId=e4ab7">e4ab7</a></td>
  //   <td>Citric Acid 7ML<br/>Ivy Extract 17ML<br/>Acai Oil 22ML</td>
  //   <td>13:07:17.000</td>
  //   <td>10:12:47.000</td>
  // </tr>
})