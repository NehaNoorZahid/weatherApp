const cityInp = document.querySelector(".city-inp");
const searchBtn = document.querySelector(".search-icon");
const apiKey = "dacbb85f23986cbd746377fae7b7a404";

const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found-city");
const searchCitySection = document.querySelector(".search-city");

const countryName = document.querySelector(".country-name");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidtyValueTxt = document.querySelector(".humidity-value-txt");
const windValueTxt = document.querySelector(".wind-value-txt");
const weatherSummaryImage = document.querySelector(".weather-summary-img");
const countryDate = document.querySelector(".country-date");

const forecastContainer = document.querySelector(".forecast-container");

searchBtn.addEventListener("click", () => {
  if (cityInp.value.trim() != "") {
    updateWeather(cityInp.value);
    cityInp.value = "";
    cityInp.blur();
  }
});

cityInp.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInp.value.trim() != "") {
    updateWeather(cityInp.value);
    cityInp.value = "";
    cityInp.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&units=metric&appid=${apiKey}`;

  const response = await fetch(apiUrl);

  return response.json();
}

async function updateWeather(city) {
  const weatherDate = await getFetchData("weather", city);

  if (!weatherDate || weatherDate.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherDate;

  countryName.textContent = country;
  tempTxt.textContent = Math.round(temp) + "°C";
  conditionTxt.textContent = main;
  humidtyValueTxt.textContent = humidity + "%";
  windValueTxt.textContent = speed + "m/s";

  countryDate.textContent = getCurrentDate();
  weatherSummaryImage.src = `assets/weather/${getweatherIcon(id)}`;

  await updateForecastInfo(city);
  showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastData = await getFetchData("forecast", city);

  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastContainer.innerHTML = '';
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
    console.log(forecastWeather);
  });
}

function updateForecastItems(weather) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weather;

  const dateTaken = new Date(date);

  const dateOption = {
    day: '2-digit',
    month: 'short'
  };

  const  dateResult = dateTaken.toLocaleDateString('en-US',dateOption);

  const forecastItem = `
    <div class="forecast-item">
      <div class="forecast-date regular-tx">${dateResult}</div>
      <img src="assets/weather/${getweatherIcon(id)}" alt=" forecast cloud" class="forecast-img">
      <h5 class="forecast-temp">${Math.round(temp)} &deg;C</h5>
    </div>
  `;

  forecastContainer.insertAdjacentHTML('beforeend', forecastItem);
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
  console.log(currentDate);
}

function getweatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function showDisplaySection(activesection) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );

  activesection.style.display = "flex";
}
