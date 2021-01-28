// Find and set Geolocation

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

        function showPosition(position) {
            localStorage.setItem("Latitude", (position.coords.latitude))
            localStorage.setItem("Longitude", (position.coords.longitude))
            // console.log(position.coords);
        }

        var userLat = localStorage.getItem("Latitude");
        var userLong = localStorage.getItem("Longitude");

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?lat=" + userLat + "&lon=" + userLong + "&units=imperial&appid=" + APIKey,
            method: "GET"
        })

            .then(function (response) {

                // console.log(response);

                populatePage(response);
                uvi(APIKey, userLat, userLong)
                airQuality(userLat, userLong, APIKey);

            })
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + userLat + "&lon=" + userLong + "&units=imperial&appid=" + APIKey,
            method: "GET"
        })

            .then(function (response) {

                console.log(response);

                populate5DayForecast(response);
            })
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

var searchForm = document.getElementById("searchForm");
var searchInput = document.getElementById("searchInput");

searchForm.addEventListener("submit", function (event) {
    localStorage.setItem("City", (searchInput.value));

    if (searchInput.value === null) {
        return localStorage.value;
    }
});

// Current Date

var currentDate = moment().format("dddd h:mm A");

// API key and saved city

var APIKey = "72b3dd6d5427d95c4537e74e9191ff5e";
var savedCity = localStorage.getItem("City");

$.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q=" + savedCity + "&units=imperial&appid=" + APIKey,

    method: "GET"
})

    .then(function (response) {

        // console.log(response);

        var userLat = response.coord.lat;
        var userLong = response.coord.lon;

        populatePage(response);
        airQuality(userLat, userLong, APIKey);
        uvi(APIKey, userLat, userLong);
    });

// Running AJAX 5 day forecast call to the OpenWeatherMap API

$.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?q=" + savedCity + "&units=imperial&appid=" + APIKey,
    method: "GET"
})

    .then(function (response) {

        // console.log(response);

        populate5DayForecast(response);
    });

function populatePage(response) {

    $("#cityName").text(response.name);
    $("#date").text(currentDate);
    var roundedTempF = Math.round(response.main.temp);
    var roundedWind = Math.round(response.wind.speed);
    var weatherDescription = response.weather[0].main;
    var maxTemp = Math.round(response.main.temp_max);
    var minTemp = Math.round(response.main.temp_min);
    var feelsLike = Math.round(response.main.feels_like);
    var pressure = Math.round((response.main.pressure / 33.8639) * 100) / 100;
    // var iconcode = response.weather[0].icon;
    // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

    if (response.weather[0].main === 'Clouds') {
        $("#weatherStats").css({ "background-image": "url(https://images.pexels.com/photos/209831/pexels-photo-209831.jpeg?auto=compress&cs=tinysrgb&dpr=2)", "color": "white", "box-shadow": "#494949 5px 10px 5px" });
    }
    if (response.weather[0].main === 'Clear') {
        $("#weatherStats").css({ "background-image": "url(https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?auto=compress&cs=tinysrgb&dpr=3)", "box-shadow": "5px 10px 5px" });
    }
    if (response.weather[0].main === 'Lightning') {
        $("#weatherStats").css({ "background-image": "url(https://images.pexels.com/photos/2531709/pexels-photo-2531709.jpeg?auto=compress&cs=tinysrgb&dpr=2)", "color": "white", "box-shadow": "#494949 5px 10px 5px" });
    }
    if (response.weather[0].main === 'Rain') {
        $("#weatherStats").css("background-image", "url(https://images.pexels.com/photos/459483/pexels-photo-459483.jpeg?auto=compress&cs=tinysrgb&dpr=3)");
    }
    if (response.weather[0].main === 'Fog') {
        $("#weatherStats").css("background-image", "url(https://images.pexels.com/photos/154246/pexels-photo-154246.jpeg?auto=compress&cs=tinysrgb&dpr=2)");
    }
    if (response.weather[0].main === 'Snow') {
        $("#weatherStats").css("background-image", "url(https://images.pexels.com/photos/60561/winter-snow-nature-60561.jpeg?auto=compress&cs=tinysrgb&dpr=2)");
    }
    if (response.weather[0].main === 'Mist') {
        $("#weatherStats").css("background-image", "url(https://images.pexels.com/photos/154246/pexels-photo-154246.jpeg?auto=compress&cs=tinysrgb&dpr=2)");
    }

    // Append info to the current weather divs

    $("#humidity").text(response.main.humidity + "%");
    $("#windSpeed").text(roundedWind + " mph");
    $('#tempMax').text(maxTemp + "°");
    $('#tempMin').text(minTemp + "°");
    $('#feelsLike').text(feelsLike + "°");
    $('#weather').text(weatherDescription);
    $('#pressure').text(pressure + " inHg");
    // $('#wicon').attr('src', iconurl);
    $('#icon').text(`${roundedTempF}°`);
    $('#icon').css({
        "font-size": "72px",
        "font-weight": "bolder"
    });
}

function airQuality(userLat, userLong, APIKey) {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + userLat + "&lon=" + userLong + "&appid=" + APIKey,
        method: "GET"
    })

        .then(function (response) {

            // console.log(response.list[0].main.aqi);

            // Append AQI values to the current weather div

            var aqi = response.list[0].main.aqi;

            if (aqi === 1) {
                $('#airQuality').text(aqi + " - Good");
            }
            if (aqi === 2) {
                $('#airQuality').text(aqi + " - Fair");
            }
            if (aqi === 3) {
                $('#airQuality').text(aqi + " - Moderate");
            }
            if (aqi === 4) {
                $('#airQuality').text(aqi + " - Poor");
            }
            if (aqi === 5) {
                $('#airQuality').text(aqi + " - Very Poor");
            }
        });

}

function uvi(APIKey, userLat, userLong) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + userLat + "&lon=" + userLong,
        method: "GET"
    })

        .then(function (response) {

            // console.log(response);

            $("#uvIndex").text(Math.round(response.value));
        });
}

function populate5DayForecast(response) {

    // Day 1 of 5-day forecast weather and text appending

    for (var i = 0; i < response.list.length - 32; i++) {

        var datePlus1 = moment().add(1, 'days').format("dddd");
        var forecastTempDay1 = response.list[i].main.temp;
        var roundedDay1 = Math.round(forecastTempDay1);
        var iconcode1 = response.list[i].weather[0].icon;
        var iconurl1 = "http://openweathermap.org/img/w/" + iconcode1 + ".png";
        var timeSlice = response.list[i].dt_txt.slice(11);

        if (timeSlice === "18:00:00") {

            $("#weatherBoxDate1").text(datePlus1);
            $('#wicon1').attr('src', iconurl1);
            $("#weatherBoxTemp1").text(roundedDay1 + "°");
            $("#weatherBoxHum1").text("Humidity: " + response.list[i].main.humidity + "%");
        }
    }

    // Day 2 of 5-day forecast weather and text appending

    for (var i = 8; i < response.list.length - 24; i++) {

        var datePlus2 = moment().add(2, 'days').format("dddd");
        var forecastTempDay2 = (response.list[i].main.temp);
        var roundedDay2 = Math.round(forecastTempDay2);
        var iconcode2 = response.list[i].weather[0].icon;
        var iconurl2 = "http://openweathermap.org/img/w/" + iconcode2 + ".png";
        var timeSlice = response.list[i].dt_txt.slice(11);

        if (timeSlice === "18:00:00") {

            $("#weatherBoxDate2").text(datePlus2);
            $("#weatherBoxTemp2").text(roundedDay2 + "°");
            $("#weatherBoxHum2").text("Humidity: " + response.list[i].main.humidity + "%");
            $('#wicon2').attr('src', iconurl2);
        }
    }

    // Day 3 of 5-day forecast weather and text appending

    for (var i = 16; i < response.list.length - 16; i++) {

        var datePlus3 = moment().add(3, 'days').format("dddd");
        var forecastTempDay3 = (response.list[i].main.temp);
        var roundedDay3 = Math.round(forecastTempDay3);
        var iconcode3 = response.list[i].weather[0].icon;
        var iconurl3 = "http://openweathermap.org/img/w/" + iconcode3 + ".png";
        var timeSlice = response.list[i].dt_txt.slice(11);

        if (timeSlice === "18:00:00") {

            $("#weatherBoxDate3").text(datePlus3);
            $("#weatherBoxTemp3").text(roundedDay3 + "°");
            $("#weatherBoxHum3").text("Humidity: " + response.list[i].main.humidity + "%");
            $('#wicon3').attr('src', iconurl3);
        }
    }

    // Day 4 of 5-day forecast weather and text appending

    for (var i = 24; i < response.list.length - 8; i++) {

        var datePlus4 = moment().add(4, 'days').format("dddd");
        var forecastTempDay4 = (response.list[i].main.temp);
        var roundedDay4 = Math.round(forecastTempDay4);
        var iconcode4 = response.list[i].weather[0].icon;
        var iconurl4 = "http://openweathermap.org/img/w/" + iconcode4 + ".png";
        var timeSlice = response.list[i].dt_txt.slice(11);

        if (timeSlice === "18:00:00") {

            $("#weatherBoxDate4").text(datePlus4);
            $("#weatherBoxTemp4").text(roundedDay4 + "°");
            $("#weatherBoxHum4").text("Humidity: " + response.list[i].main.humidity + "%");
            $('#wicon4').attr('src', iconurl4);
        }
    }

    // Day 5 of 5-day forecast weather and text appending

    for (var i = 32; i < response.list.length; i++) {

        var datePlus5 = moment().add(5, 'days').format("dddd");
        var forecastTempDay5 = (response.list[i].main.temp);
        var roundedDay5 = Math.round(forecastTempDay5);
        var iconcode5 = response.list[i].weather[0].icon;
        var iconurl5 = "http://openweathermap.org/img/w/" + iconcode5 + ".png";
        var timeSlice = response.list[i].dt_txt.slice(11);

        if (timeSlice === "18:00:00") {

            $("#weatherBoxDate5").text(datePlus5);
            $("#weatherBoxTemp5").text(roundedDay5 + "°");
            $("#weatherBoxHum5").text("Humidity: " + response.list[i].main.humidity + "%");
            $('#wicon5').attr('src', iconurl5);
        }
    }
}
