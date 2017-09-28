//Geolocation Api only works with https
// If not loaded with https you will see infinite loading icon....

$(document).ready(function() {
  var lat, lng, address, temp;
  //Time function
  function timer() {
    var today = new Date();
    var hrs = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    if (hrs < 10) {
      hrs = "0" + hrs;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    $(".hrs").text(hrs);
    $(".min").text(min);
    $(".sec").text(sec);
  }
  timer();
  setInterval(timer, 1000);
  var today = new Date();
  $(".current-day").text(today.toDateString());
  //Find address
  function renderAddress(address) {
    $(".city").text(address);
  }
  var tempInC = true;
  //convertToFahrenheit function
  function convertToFahrenheit(temp) {
    tempInC = false;
    return Math.floor(temp * 9 / 5 + 32) + '<i class="wi wi-fahrenheit"></i>';
  }
  //Weather function
  function loadWeather(lat, lng) {
    $.ajax({
      url:
        "https://api.forecast.io/forecast/9b8691b6874edb2cfbd48f72378c5dcb/" +
        lat +
        "," +
        lng,
      dataType: "json",
      beforeSend: function(xhr) {
        $(".loading").fadeIn();
      },
      complete: function(xhr, status) {
        $(".loading").hide();
      },
      success: function(result, status, xhr) {
        console.log(result);
        var currentWeather = result.currently;

        var iconHtml =
          '<i class="wi wi-forecast-io-' + currentWeather.icon + '"></i>';
        $(".icon").html(iconHtml);
        $(".summary").text(currentWeather.summary);
        temp = Math.floor((currentWeather.temperature - 32) * (5 / 9));

        $(".temperature").html(temp + '<i class="wi wi-celsius"></i>');
        $(".last-updated .value").text(
          new Date(currentWeather.time).toLocaleTimeString()
        );
      },
      error: function(xhr, status, error) {
        console.log(error);
      }
    });
  }
  //Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      lat = position.coords.latitude;
      lng = position.coords.longitude;
      $.getJSON(
        "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          lat +
          "," +
          lng +
          "&sensor=true",
        function(json) {
          address = json.results[0].formatted_address;
          renderAddress(address);
        }
      );
      loadWeather(lat, lng);
    });
  } else {
    console.warn("Browser Does Not Support Geolocation Api");
  }
  //Change temperature
  $("#toggle-temp").on("click", function(e) {
    e.preventDefault();
    if (tempInC) {
      var changedTemp = convertToFahrenheit(temp);
      $(".temperature").html(changedTemp);
      $(this).css("padding", "10px");
      $(this).text("Celsius");
    } else {
      tempInC = true;
      $(".temperature").html(temp + '<i class="wi wi-celsius"></i>');
      $(this).text("Fahrenheit");
    }
  });
  //Refresh function
  $("#refresh").on("click", function(e) {
    e.preventDefault();
    loadWeather(lat, lng);
  });
});
