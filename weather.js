// Const variables
const forecastIconElement = document.querySelector(".forecastIcon");
const locationElement = document.querySelector(".location p");
const temperatureElement = document.querySelector(".temperature p");
const tempDescriptionElement = document.querySelector(".tempDescription p");
const highLowElement = document.querySelector(".high-low p");
const key = "**************************"; // API key (kept private)

// Weather object containing app data 
const weather = {};

weather.temperature = {
	unit: "fahrenheit"
};

// Displays current date in month day, year format
let today = new Date();
let month = today.toLocaleString('default', {
	month: 'long'
})
let day = today.getUTCDate();
let year = today.getUTCFullYear();
document.getElementById("date").innerHTML = month + " " + day + ", " + year;

// Will allow users to search for different locations using search box
const searchbar = document.querySelector(".searchbar");
searchbar.addEventListener("keypress", setQuery);


/* When user presses the enter key it will call the getWeatherData function passing the city
user entered into the search bar as an argument */
function setQuery(evt) {
	if (evt.keyCode == 13) {
		getWeatherData(searchbar.value);
	}
}

// Will fetch weather data from API depending on what city user enters in searchbar 
function getWeatherData(query) {
	fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&units=imperial&APPID=${key}`)
		.then(weather => {
			return weather.json();
		}).then(displayWeatherData);
}

/* Will display weather data including location, current temp, forecast icon and temperature 
description as well as max and min temps. */
function displayWeatherData(weather) {
	let city = document.querySelector(".location p");
	city.innerText = `${weather.name}, ${weather.sys.country}`;

	let temp = document.querySelector(".temperature p");
	temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;

	let description = document.querySelector(".tempDescription p");
	description.innerText = `${weather.weather[0].main}`;

	let forecast = document.querySelector(".forecastIcon");
	forecast.innerHTML = `<img src="icons/${weather.weather[0].icon}.png"/>`;

	let highLow = document.querySelector(".high-low p");
	highLow.innerText = `${Math.floor(weather.main.temp_max)}°F / ${Math.floor(weather.main.temp_min)}°F`;

	// Will allow user to convert main temp from fahrenheit to celsius by clicking on main temp
	temp.addEventListener("click", function () {

		if (weather.main.unit == "fahrenheit") {
			let celsius = (`${Math.round(weather.main.temp)}` - 32) * 5 / 9;
			celsius = Math.floor(celsius);

			temp.innerHTML = `${celsius}<span>°C</span>`;
			weather.main.unit = "celsius";

		} else {
			temp.innerHTML = `${Math.round(weather.main.temp)}<span>°F</span>`;
			weather.main.unit = "fahrenheit";
		}
	})

}

// Checks if user's browser supports geolocation 
if ('geolocation' in navigator) {
	navigator.geolocation.getCurrentPosition(setPosition); // If user allows geolocation
} else {
	alert("Your browser doesn't support geolocation.");
};

// Sets user's position
function setPosition(position) {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;

	getWeather(latitude, longitude);
}


// Requesting a response from the API to retrieve data
function getWeather(latitude, longitude) {
	let api = `https://api.openweathermap.org/data/2.5/weather?&units=imperial&lat=${latitude}&lon=${longitude}&APPID=${key}`;

	fetch(api)
		.then(function (response) {
			let data = response.json(); // Retrieves data from api
			return data;
		})

		.then(function (data) {
			weather.temperature.value = Math.floor(data.main.temp);
			weather.description = data.weather[0].description;
			weather.icon = data.weather[0].icon;
			weather.city = data.name;
			weather.country = data.sys.country;
			weather.max = Math.round(data.main.temp_max);
			weather.min = Math.round(data.main.temp_min);

		}).then(function () {
			displayWeather();
		});
}

// Function will display temprature, temperature description, location, and forecast icon.
function displayWeather() {
	forecastIconElement.innerHTML = `<img src="icons/${weather.icon}.png"/>`;
	temperatureElement.innerHTML = `${weather.temperature.value}<span>°F</span>`;
	tempDescriptionElement.innerHTML = `${weather.description}`;
	locationElement.innerHTML = `${weather.city}, ${weather.country}`;
	highLowElement.innerHTML = `${weather.max}°F / ${weather.min}°F`;
}


// Changes main temperature from geolocation from fahrenheit to celsius with a click. 
temperatureElement.addEventListener("click", function () {

	if (weather.temperature.unit == "fahrenheit") {
		let celsius = (`${weather.temperature.value}` - 32) * 5 / 9;
		celsius = Math.floor(celsius);

		temperatureElement.innerHTML = `${celsius}<span>°C</span>`;
		weather.temperature.unit = "celsius";
	} else {
		temperatureElement.innerHTML = `${weather.temperature.value}<span>°F</span>`;
		weather.temperature.unit = "fahrenheit";
	}
})