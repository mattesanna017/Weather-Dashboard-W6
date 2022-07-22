var today = new Date();
var cityForm = document.querySelector("#cityForm");
var cityNameInput = document.querySelector("#cityName");
var currentWeather = document.querySelector('#currentWeather');
var currentWeatherCard = document.querySelector("#currentWeatherCard")
var fiveDayCard = document.querySelector("#fiveDayCard");
var fiveDay = document.querySelector("#fiveDay");
var weatherStatus = document.querySelector('#weatherStatus');
var searchEl = document.querySelector('#search');
var historyButton = document.querySelector("#historyButton")
var historyCard = document.querySelector("#historyCard")

var searchHistoryArray = []


var submitHandler = function (event) {
    event.preventDefault();

    var cityName = cityNameInput.value.trim();

    // Set city name in local storage and generate history buttons
    if (cityName) {
        searchHistoryArray.push(cityName);
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));
        var searchHistoryEl = document.createElement('button');
        searchHistoryEl.className = "btn";
        searchHistoryEl.setAttribute("dataCity", cityName)
        searchHistoryEl.innerHTML = cityName;
        historyButton.appendChild(searchHistoryEl);
        historyCard.removeAttribute("style")
        weatherInfo(cityName);
        cityNameInput.value = "";
    }
    else {
        alert("Please enter a City name");
    }

}


// Get weather information from OpenWeather
var weatherInfo = function (cityName) {
    var apiKEY = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";

    fetch( 
        apiKEY
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            console.log(cityResponse)
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord.lon;

            var city = cityResponse.name;
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon;
            var weatherDescription = cityResponse.weather[0].description;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"

            currentWeather.textContent = "";
            fiveDay.textContent = "";

            weatherStatus.innerHTML = city + " (" + date + ") " + weatherIconLink;

            currentWeatherCard.classList.remove("hidden");
            fiveDayCard.classList.remove("hidden");

            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {

            return response.json();
        })
        .then(function (response) {
            console.log(response);
            displayWeather(response);

        });
};

// Display the weather on page
var displayWeather = function (weather) {

    if (weather.length === 0) {
        weatherContainerEl.textContent = "No weather data found.";
        return;
    }

    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeather.appendChild(temperature);

    var humidity = document.createElement('p');
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentWeather.appendChild(humidity);

    var windSpeed = document.createElement('p');
    windSpeed.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    currentWeather.appendChild(windSpeed);

    var uvIndex = document.createElement('p');
    var uvIndexValue = weather.current.uvi.toFixed(1);
    uvIndex.id = "uv-index";
    if (uvIndexValue >= 0) {
        uvIndex.className = "uv-index-green"
    }
    if (uvIndexValue >= 3) {
        uvIndex.className = "uv-index-yellow"
    }
    if (uvIndexValue >= 8) {
        uvIndex.className = "uv-index-red"
    }
    uvIndex.innerHTML = "<strong>UV Index:</strong> <span>" + uvIndexValue + "</span>";
    currentWeather.appendChild(uvIndex);

    var forecastArray = weather.daily;

    for (let i = 0; i < forecastArray.length - 3; i++) {
        var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
        var weatherIcon = forecastArray[i].weather[0].icon;
        var weatherDescription = forecastArray[i].weather[0].description;
        var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
        var dayEl = document.createElement("div");
        dayEl.className = "day";
        dayEl.innerHTML = "<p><strong>" + date + "</strong></p>" +
            "<p>" + weatherIconLink + "</p>" +
            "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
            "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>" +
            "<p><strong>Wind Speed:</strong> " + forecastArray[i].wind_speed + " MPH</p>"

        fiveDay.appendChild(dayEl);

    }

}

// Load any past city weather searches
var showHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistoryEl = document.createElement('button');
            searchHistoryEl.className = "btn";
            searchHistoryEl.setAttribute("dataCity", searchArray[i])
            searchHistoryEl.innerHTML = searchArray[i];
            historyButton.appendChild(searchHistoryEl);
            historyCard.removeAttribute("style");
        }

    }
}

// Search weather using search history buttons
var historyHandler = function (event) {
    var cityName = event.target.getAttribute("dataCity");
    if (cityName) {
        weatherInfo(cityName);
    }
}

// Clear Search History
var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCard.setAttribute("style", "display: none");
}

cityForm.addEventListener("submit", submitHandler);
historyButton.addEventListener("click", historyHandler);


showHistory();