const weatherAppKey = "1632f3982b6b4ebabca619e2503320d3";
let searchButton = document.getElementById("search-btn");
let searchInput = document.getElementById("search-txt");

//Event listeners
searchButton.addEventListener("click", findWeatherDetails);
searchInput.addEventListener("keyup", enterPressed);

//Create elements on search event
let ul = document.createElement("ul");
ul.setAttribute('id', 'city-top');
ul.setAttribute('style', 'list-style: none;');
document.getElementById("left-column").appendChild(ul);
//first li tag
let topLi = document.createElement("li");
topLi.setAttribute('id', 'city-info');
ul.appendChild(topLi);

let h1 = document.createElement("h1");
h1.setAttribute('id','city-header');

let cityName = document.createElement("span");
cityName.setAttribute('id', 'city-name');

let stateName = document.createElement("span");
stateName.setAttribute('id', 'state-name');

let country = document.createElement("span");
country.setAttribute('id', 'country-name');

let summary = document.createElement("span");
summary.setAttribute('id', 'summary');
let br = document.createElement('br');
//display items in h1 of first li tag
topLi.appendChild(h1);
h1.appendChild(cityName);
h1.appendChild(stateName);
h1.appendChild(country);
h1.appendChild(br);
h1.appendChild(summary);

//second li tag
let tempLi = document.createElement("li");
tempLi.setAttribute('id', 'temperature-info');
ul.appendChild(tempLi);

let tInfo = document.createElement("h1");
tempLi.appendChild(tInfo);

let iconSpan = document.createElement("span");
let icon = document.createElement("img");
icon.setAttribute('id', 'icon');
icon.setAttribute('src', '');
icon.setAttribute('alt', '');
iconSpan.appendChild(icon);

let temperature = document.createElement("span");
temperature.setAttribute('id', 'temp');
//display items in h1 of second li tag
tInfo.appendChild(temperature);
tInfo.appendChild(iconSpan);

//second ul tag
let footerUl = document.createElement('ul');
footerUl.setAttribute('id', 'footer-list');
footerUl.setAttribute('style', 'list-style: none;');
document.getElementById("right-column").appendChild(footerUl);

let feelsTemp = document.createElement("li");
feelsTemp.setAttribute('id', 'feels-temp');

let humidity = document.createElement("li");
humidity.setAttribute('id', 'humidity');

let dewPoint = document.createElement("li");
dewPoint.setAttribute('id', 'dew-point');

let visibility = document.createElement("li");
visibility.setAttribute('id', 'visibility');

let wind = document.createElement("li");
wind.setAttribute('id', 'wind-info');

let windDirection = document.createElement("span");
windDirection.setAttribute('id', 'wind-direction');
//create an li to print wind speed and direction on one line.
let windSpeed = document.createElement("span");
windSpeed.setAttribute('id', 'wind-speed');
wind.appendChild(windSpeed);
wind.appendChild(windDirection);

footerUl.appendChild(feelsTemp);
footerUl.appendChild(humidity);
footerUl.appendChild(dewPoint);
footerUl.appendChild(visibility);
footerUl.appendChild(wind);

//Retrieve from local storage
let savedCity = localStorage.getItem('searchInput');
let savedState = localStorage.getItem('stateName');
let savedCountry = localStorage.getItem('country');
let savedTemp = localStorage.getItem('temperature');
let savedIcon = localStorage.getItem('icon');
let savedSummary = localStorage.getItem('summary');
let savedHumidity = localStorage.getItem('humidity');
let savedFeelsTemp = localStorage.getItem('feelsTemp');
let savedDewPt = localStorage.getItem('dewPoint');
let savedWindSp = localStorage.getItem('windSpeed');
let savedVis = localStorage.getItem('visibility');
let savedWindDir = localStorage.getItem('windDirection');

// 
if (savedCity !="null") {
  cityName.innerHTML = savedCity;
  temperature.innerHTML = savedTemp;
  humidity.innerHTML = savedHumidity;
  feelsTemp.innerHTML = savedFeelsTemp;
  summary.innerHTML =  savedSummary;
  stateName.innerHTML =  savedState;
  country.innerHTML =  savedCountry;
  // date.innerHTML =  new Date();
  icon.src =  savedIcon;
  dewPoint.innerHTML =  savedDewPt;
  visibility.innerHTML =  savedVis;
  windDirection.innerHTML =  savedWindDir;
  windSpeed.innerHTML =  savedWindSp;
} else {
  //add hidden class
  let hidden = document.getElementById('results');
  hidden.style.display = 'none';
}

function enterPressed(event) {
  if (event.key === "Enter") {
    findWeatherDetails();
    //clear input field after submitting
    searchInput.value = "";
    //remove hidden class
  }
}

function findWeatherDetails() {
  if (searchInput.value === "") {
    //enter an error for blank input
  } else {
    //find the city's temperature
    let searchLink = "https://api.weatherbit.io/v2.0/current?city=" + searchInput.value + "&units=I&key=" + weatherAppKey;
   httpRequestAsync(searchLink, theResponse);
  }
 }
 //get user's location and plug it into the api
 function getLocation() {
  if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(pos) {
  //You have your locaton here
  lon = pos.coords.longitude;
  lat = pos.coords.latitude;
    console.log("Latitude: " + lat + " Longitude: " + lon);
    let locationLink = "https://api.weatherbit.io/v2.0/current?&lat=" + lat + "&lon=" + lon + "&units=I&key=" + weatherAppKey;
    httpRequestAsync(locationLink, theResponse);
  });
  } else {
    //error messages
    console.log("Geolocation is not supported by this browser.");
  }
}
 //get elements from json to display
function theResponse(response) {
  let jsonObject = JSON.parse(response);
  cityName.innerHTML = jsonObject.data[0].city_name + ",";
  stateName.innerHTML = jsonObject.data[0].state_code;
  country.innerHTML = jsonObject.data[0].country_code;
  // dateTime.innerHTML = jsonObject.data[0].datetime;
  icon.src = "icons/" + jsonObject.data[0].weather.icon + ".png";

  temperature.innerHTML = parseInt(jsonObject.data[0].temp) + "°";

  // let celcius = parseInt(jsonObject.data[0].temp - 32) * ( 5 / 9);
  // console.log(Math.floor(celcius));
  dewPoint.innerHTML = `<i class='fas fa-tint'></i> ` + " Dew Point: " + parseInt(jsonObject.data[0].dewpt) + "°";
  //feels-like temp
  feelsTemp.innerHTML = `<i class='fas fa-temperature-high'></i> ` + " Heat Index: " + parseInt(jsonObject.data[0].app_temp) + "°";
  //relative humidity
  humidity.innerHTML = `<i class='fas fa-mug-hot'></i> ` + " Humidity: " + jsonObject.data[0].rh + "%";
  //description
  summary.innerHTML = jsonObject.data[0].weather.description;
  windDirection.innerHTML = `<i class="far fa-compass"></i> ` + jsonObject.data[0].wind_cdir;
  windSpeed.innerHTML = `<i class='fas fa-wind'></i> ` + " Wind: " + parseInt(jsonObject.data[0].wind_spd * 2.237) + " mph | ";
  visibility.innerHTML = `<i class='far fa-eye'></i> ` + " Visibility: " + parseInt(jsonObject.data[0].vis / 1.609) + " mi";
  //Save city data to local storage
  localStorage.setItem('searchInput', cityName.innerHTML);
  localStorage.setItem('stateName', stateName.innerHTML);
  localStorage.setItem('country', country.innerHTML);
  localStorage.setItem('temperature', temperature.innerHTML);
  localStorage.setItem('humidity', humidity.innerHTML);
  localStorage.setItem('feelsTemp', feelsTemp.innerHTML);
  localStorage.setItem('dewPoint', dewPoint.innerHTML);
  localStorage.setItem('summary', summary.innerHTML);
  localStorage.setItem('visibility', visibility.innerHTML);
  localStorage.setItem('windDirection', windDirection.innerHTML);
  localStorage.setItem('windSpeed', windSpeed.innerHTML);
  localStorage.setItem('icon', icon.src);

  console.log(jsonObject);
}

function httpRequestAsync(url, callback)
{
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => { 
        if (httpRequest.readyState == 4 && httpRequest.status == 200)
            callback(httpRequest.responseText);
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();
}
