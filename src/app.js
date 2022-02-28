function formatTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
              ${formatDay(forecastDay.dt)}
              ${index}
              <img
                  src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png"
                  width="45"
                />
              ${Math.round(forecastDay.temp.max)}°
              ${Math.round(forecastDay.temp.min)}°
          </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getTheForecast(coordinates) {
  let apiKey = "d23a0d3530ddedd914cb8e35a010be9d";
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  let weatherElement = document.querySelector("#conditions");
  weatherElement.innerHTML = response.data.weather[0].description;

  celsiusTemperature = response.data.main.temp;

  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let humidityElement = document.querySelector("#humidity");
  let humidityData = response.data.main.humidity;
  humidityElement.innerHTML = `Humidity: ${humidityData}%`;

  let windElement = document.querySelector("#wind");
  let speedData = Math.round(response.data.wind.speed);
  windElement.innerHTML = `Speed: ${speedData}Km/H`;

  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatTime(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  let currentIcon = response.data.weather[0].icon;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${currentIcon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getTheForecast(response.data.coord);
}

function search(city) {
  let apiKey = "d23a0d3530ddedd914cb8e35a010be9d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  celsius.classList.remove("active");
  fahrenheit.classList.add("active");
  let fahrenheitTemp = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemp);
}

function displayCelcius(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheit = document.querySelector("#fahrenheit-link");
fahrenheit.addEventListener("click", displayFahrenheit);

let celsius = document.querySelector("#celsius-link");
celsius.addEventListener("click", displayCelcius);

search("Edinburgh");
displayForecast();
