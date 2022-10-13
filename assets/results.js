// initialize global variables
var weatherData;
var parkData;
var routeData;
var userLocation = "";
var userSearch = "";
var locationData = {};
var myMap;

onLoad();

function onLoad() {
  modalLink();
  loadLocalStorage();
  displayBackgroundImage();
  getLatLon(userLocation);
  generateWeatherCard()
  findParksRelatedTo(userSearch, locationData);
  $('#search-again-btn').on('click', searchAgain);  
}

function loadLocalStorage() {
  if (JSON.parse(localStorage.getItem('userLocation'))) {
    // if there exists some localstorage, assign the value of the search history to it
    userLocation = JSON.parse(localStorage.getItem('userLocation'));
  } else {
    // if not, create an empty one
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
  }
  if (JSON.parse(localStorage.getItem('userSearch'))) {
    // if there exists some localstorage, assign the value of the search history to it
    userSearch = JSON.parse(localStorage.getItem('userSearch'));
  } else {
    // if not, create an empty one
    localStorage.setItem('userSearch', JSON.stringify(userSearch));
  }
  if (JSON.parse(localStorage.getItem('locationData'))) {
    // if there exists some localstorage, assign the value of the search history to it
    locationData = JSON.parse(localStorage.getItem('locationData'));
  } else {
    // if not, create an empty one
    localStorage.setItem('locationData', JSON.stringify(locationData));
  }
}

// Preston's API key 9d63d6881d944cc0b56b419592045f7b
// Sample request https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY

function getForecast(userLocation) {
  var cityName = userLocation;
  /* 
      &lat=38.123&lon=-78.543
      &city=Raleigh&country=US
      &city=Raleigh,NC
      &city=Raleigh,North+Carolina
  */
  var requestUrl = 'https://api.weatherbit.io/v2.0/forecast/daily?city=' + cityName + '&key=9d63d6881d944cc0b56b419592045f7b'
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response) {
    weatherData = response;
    updateWeather();
  })
}

// National Parks Service API 
// THIS API IS CURRENTLY IN DEVELOPMENT maybe we can contribute to it sometime
// Preston's API Key VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG

function findParksRelatedTo(searchTerm) {
  var requestUrl = 'https://developer.nps.gov/api/v1/parks?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  // get the parks related to the search term gives parkCode fairly limited
  /*
  var requestUrl = 'https://developer.nps.gov/api/v1/activities?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  not sure if this one is useful
  var requestUrl = 'https://developer.nps.gov/api/v1/alerts?parkCode=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  get alerts by parkCode 
  var requestUrl = 'https://developer.nps.gov/api/v1/amenities?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  unfortunately this one doesn't seem to be useful, test it out more
  var requestUrl = 'https://developer.nps.gov/api/v1/campgrounds?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  get campgrounds by parkCode
  var requestUrl = 'httpss://developer.nps.gov/api/v1/events?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  get events by parkCode
  var requestUrl = 'https://developer.nps.gov/api/v1/parkinglots?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  get parkinglot info by parkCode
  var requestUrl = 'https://developer.nps.gov/api/v1/parks?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  search for parks by some text, gives the park code and tons of data, as well as lat & lon (for weather) for results ALSO SEARCHABLE BY PARKCODE
  var requestUrl = 'https://developer.nps.gov/api/v1/places?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  search for places and related parks by some text, gives lat and lon, and parkCode for related parks ALSO SEARCHABLE BY PARKCODE
  var requestUrl = 'https://developer.nps.gov/api/v1/thingstodo?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  search for things to do by text, parkcode, gives parkcode, lat and lon
  var requestUrl = 'https://developer.nps.gov/api/v1/visitorcenters?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  get visitor center by parkcode or search text, gives lat lon parkcode, hours, address, desc
  */
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response) {
    parkData = response;
    sortParkData(response);
    displayResults();
  })
}

// MapQuest API
// MapQuest route API gives distance as well as some other stuff
// Michael's API key Q87JNminvctmB5QAimcXQlzSf33AmhqY

function getLatLon(userLocation) {
  var searchTerm = userLocation;
  var requestUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=Q87JNminvctmB5QAimcXQlzSf33AmhqY&location=' + searchTerm;
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response) {
    locationData = response.results[0].locations[0].latLng;
    localStorage.setItem('locationData', JSON.stringify(locationData));
  })
}

function initMap() {
  L.mapquest.key = 'Q87JNminvctmB5QAimcXQlzSf33AmhqY';
  console.log("map initialized")
  console.log([locationData.lat, locationData.lng])
  // 'map' refers to a <div> element with the ID map
  myMap = L.mapquest.map('map', {
    center: [locationData.lat, locationData.lng],
    layers: L.mapquest.tileLayer('map'),
    zoom: 12
  });
}

function displayMap(startPoint, endPoint) {
  console.log("map updated")
  var directions = L.mapquest.directions();
  directions.route({
    start: startPoint,
    end: endPoint
  });
}

// function closeMap() {
//   // if mapInstance && mapInstance.remove
//   // map.off()
//   // map.remove()
//   myMap.remove();
// }

// Function to get the geographical distance between two points (lat, lon)
// https://en.wikipedia.org/wiki/Geographical_distance
// start = [lat, lon]
// end = [lat, lon]
// var distance = getDistance(start, end);

function getDistance(start, end) {
  var earthRadius = 3958.761;
  var deltaPhi = (start[0] - end[0]) * Math.PI / 180; // convert deltaPhi to radian, diff in lat
  var deltaLambda = (start[1] - end[1]) * Math.PI / 180; // convert deltaLambda to radian, diff in lon
  var meanLat = (start[0] + end[0]) / 2 * Math.PI / 180; // convert mean lat to radian
  return Math.round(earthRadius * Math.sqrt(Math.pow(deltaPhi, 2) + Math.pow(Math.cos(meanLat) * deltaLambda, 2)));
}


// sorts the response data and returns the five closest results
function sortParkData(completeResponse) {
  // iterate through the complete response, and calculate distance from user supplied lat / lon. 
  var userLocation = [locationData.lat, locationData.lng]; // Houston coords for now
  for (let i = 0; i < completeResponse.limit; i++) {
    var parkCoords = [Number(completeResponse.data[i].latitude), Number(completeResponse.data[i].longitude)];
    var distanceCal = getDistance(userLocation, parkCoords);
    completeResponse.data[i].distance = distanceCal;
  }
  completeResponse.data.sort(compareFn);
  parkData = completeResponse;
  function compareFn(a, b) {
    return a.distance - b.distance
  }
}

// Michael - Random background image function
function displayBackgroundImage() {
  var imageArr = [
    "./assets/images/background_images/big_prairie.jpg",
    "./assets/images/background_images/delicate_arch.jpg",
    "./assets/images/background_images/denali.jpg",
    "./assets/images/background_images/grand_teton.jpg",
    "./assets/images/background_images/mcdonald_creek.jpg",
    "./assets/images/background_images/mesa_arch.jpg",
    "./assets/images/background_images/santa_elena_canyon.jpg",
    "./assets/images/background_images/white_sands.jpg"
  ]
  var backgroundImage = imageArr[Math.floor(imageArr.length * Math.random())];
  $('body').css('background-image', 'url(' + backgroundImage + ')');
}

//Michael - Dynamic HTML generation for results Page 
function displayResults() {
  
  userSearch = JSON.parse(localStorage.getItem('userSearch'));
  userLocation = JSON.parse(localStorage.getItem('userLocation'));

$('#search-terms').text('Displaying results for ' + userSearch + ' near ' + userLocation + '.');
  var resultsColumn = $('#results-column');
  for (i = 0; i < 10; i++) {

    var resultItemCard = $('<div>').addClass('card border block js-modal-trigger').attr('id', `card${i}`).attr('data-target', 'detail-modal');
    var parkName = $('<p>').addClass('title is-4 ml-2 mt-1').text(parkData.data[i].fullName);
    var parkState = $('<p>').addClass('subtitle is-6 ml-2 mb-2').text(parkData.data[i].states);
    var parkDescription = $('<p>').addClass('ml-2').text(parkData.data[i].description.slice(0, 75) + '...');
    var parkDistance = $('<p>').addClass('ml-2 mb-1 text-center has-text-weight-bold').text('Distance: ' + parkData.data[i].distance + ' mi');

    resultItemCard.append(
      parkName,
      parkState,
      parkDescription,
      parkDistance,
    );
    resultsColumn.append(resultItemCard);
  }
  modalLink();

}
// Function to display Park Details
function displayParkDetails(findIndexOf) {
  if (myMap) {
    myMap.remove();
  }
  
  initMap();
  var indexOfData = parseInt(findIndexOf);
  // //appending park details to modal

  displayMap(userLocation, parkData.data[indexOfData].addresses[0].city + ", " + parkData.data[indexOfData].addresses[0].stateCode);
  getForecast(parkData.data[indexOfData].addresses[0].city + ", " + parkData.data[indexOfData].addresses[0].stateCode);

  $("#park-name").text(parkData.data[indexOfData].fullName);
  $("#park-desc").text(parkData.data[indexOfData].description);
  $("#park-details").html('<ul><li><a href=' + 'https://www.nps.gov/' + parkData.data[indexOfData].parkCode + '/planyourvisit/things2do.htm target=_blank>All Activities</a></li><li><a href=' + parkData.data[indexOfData].url + ' target=_blank>Park Website</a></li>');
}

function updateWeather() {
  // for each of the five days for the forecast
  for (let i = 0; i < 5; i++) {
    // for each weather element, set the appropriate value
    var currentCard = $(`#day${i + 1}`);
    var weatherSpans = currentCard.find("span");
    // weathderData.data[i] is the i-th day's weather data
    $(weatherSpans[0]).text(weatherData.data[i].temp + " " + String.fromCharCode(186) + "C "); // temp data
    $(weatherSpans[1]).text(weatherData.data[i].wind_spd + " m/s"); // wind data
    $(weatherSpans[2]).text(weatherData.data[i].rh + " %"); // humidity data
    $(weatherSpans[3]).text(weatherData.data[i].pop + " %"); // rain data
    $(weatherSpans[4]).text(weatherData.data[i].moon_phase_lunation); // moon cycle
    $(weatherSpans[5]).html('<img src="https://www.weatherbit.io/static/img/icons/' + weatherData.data[i].weather.icon + '.png" alt="' + weatherData.data[i].weather.description + '">'); // weather icon]
    $(weatherSpans[6]).text(weatherData.data[i].weather.description); // Description
    $(weatherSpans[7]).text(weatherData.data[i].vis + " km"); // visibility
  }
}

/*
<div class="column" id="day1">
            <!-- // here is the weather data -->
            <p>Temperature: <span id="temp1"></span></p>
            <p>Wind: <span id="wind1"></span></p>
            <p>Humidity: <span id="Humidity1"></span></p>
            <p>Chance of Rain: <span id="Rain1"></span></p>
            <p>Moon Cycle: <span id="Moon1"></span></p>
            <p><span id= "Weathericon1"></span></p>
            <p>Description: <span id="Description1"></span></p>
            <p>Visibility : <span id="Visibility1"></span></p>
          </div>
*/

function generateWeatherCard() {
  // generate five cards with appropriate default text for filling with data
  var weatherSection = $("#weather");
  weatherSection.css("margin-top","10px");
  for (let i = 0; i < 5; i++) {
    // for each card, generate the default text
    var myCard = $("<div>");
    myCard.css({"border":"3px solid","border-radius":"10px", "margin":"10px"});
    myCard.addClass("column");
    myCard.attr("id", `day${i + 1}`);
    var myTemp = $("<p>");
    myTemp.html('Temperature: <span id="temp' + `${i + 1}` + '"></span>');
    var myWind = $("<p>");
    myWind.html('Wind: <span id="wind' + `${i + 1}` + '"></span>');
    var myHumidity = $("<p>");
    myHumidity.html('Humidity: <span id="Humidity' + `${i + 1}` + '"></span>');
    var myPOP = $("<p>");
    myPOP.html('Chance of Rain: <span id="Rain' + `${i + 1}` + '"></span>');
    var myMoon = $("<p>");
    myMoon.html('Moon Cycle: <span id="Moon' + `${i + 1}` + '"></span>');
    var myIcon = $("<p>");
    myIcon.html('<span id= "Weathericon' + `${i + 1}` + '"></span>');
    var myDesc = $("<p>");
    myIcon.html('Description: <span id="Description' + `${i + 1}` + '"></span>');
    var myVis = $("<p>");
    myVis.html('Visibility: <span id="Visibility' + `${i + 1}` + '"></span>');
    myCard.append(myTemp, myWind, myHumidity, myPOP, myMoon, myIcon, myDesc, myVis);
    weatherSection.append(myCard);
  }
}

function searchAgain() {
  window.location.assign('./index.html');
}