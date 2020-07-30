// Create elements to link to the classes in index.html

const notificationElement = document.querySelector(".notification");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

const KELVIN = 273;
// OpenSky Key
const key = "63739e5eab0f60ef4ab9478884e4077c";

// Store the weather data.
const weather = {
  temperature : {
    value : 43,
    unit : "celsius"
  },

  description : "Sunny",
  city : "Las Vegas",
  country : "United States"
};

// To change the inner html.
tempElement.innerHTML = 
  `${weather.temperature.value}° <span>C</span>`;

descElement.innerHTML = 
  weather.description;

locationElement.innerHTML = 
  `${weather.city}, ${weather.country}`;

// When clicked, convert from C to F and vice versa.
tempElement.addEventListener("click", function(){
  if(weather.temperature.value === undefined) return;
  if(weather.temperature.unit === "celsius"){
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);
    tempElement.innerHTML = `${fahrenheit}° <span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
    weather.temperature.unit = "celsius";
  }
})

// Convert Celsius to fahrenheit when called.
function celsiusToFahrenheit (temperature) {
  return (temperature * 9/5) + 32;
}

// Get user location IF geolocation is enabled.
if("geolocation" in navigator){
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>No location data could be found.</p>"
}

// Grab user location using coordinates.
function setPosition(position){
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeather(latitude, longitude);
}

// If coordinates not found, show an error message.
function showError(error){
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// Get data from the OpenSky Weather API.
function getWeather(latitude, longitude){
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetch(api).then(function(response){
    let data = response.json();
    return data;
  })
  .then(function(data){
  weather.temperature.value = Math.floor(data.main.temp - KELVIN);
  weather.description = data.weather[0].description;
  weather.city = data.name;
  weather.country = data.sys.country;
  })
  .then(function(){
    displayWeather();
  });
}

// Display weather data to the interface.
function displayWeather(){
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}