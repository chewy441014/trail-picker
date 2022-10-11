// Launching location modal on page load

$(document).ready(function(){
 
    $("#location-modal").addClass("is-active");
 
});


// initialize global variables
var weatherData;
var parkData;
var routeData;
var searchArr = [weatherData, parkData, routeData];
modalLink();

// Preston's API key 9d63d6881d944cc0b56b419592045f7b
// Sample request https://api.weatherbit.io/v2.0/forecast/daily?city=Raleigh,NC&key=API_KEY

function getForecast() {
    var cityName = "Santa Barbara"; // insert user submitted text once we have the DOM element
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
        console.log('AJAX Response \n-------------');
        console.log(response);
        console.log(response.city_name); // string city name
        console.log(response.lat); // string latitude
        console.log(response.lon); // string longitude
        console.log(response.data); // array of sixteen objects. Each object is the weather data for one day
        console.log(response.data[0].temp); // average temp for day 0
        console.log(response.data[0].pop); // percent chance of rain
        console.log(response.data[0].high_temp); // temp high
        console.log(response.data[0].low_temp); // temp low
        console.log(response.data[0].rh); // relative humidity
        console.log(response.data[0].weather.icon); // weather icon code
        console.log(response.data[0].weather.description); // weather description
        console.log(response.data[0].ts); // unix time stamp
        console.log(response.data[0].wind_spd)
        console.log(response.data[0].precip)
        console.log(response.data[0].snow)
        console.log(response.data[0].clouds)
        console.log(response.data[0].vis) //visibility
        console.log(response.data[0].ozone)
        console.log(response.data[0].sunrise_ts)
        weatherData = response;
        // and more
    })
}

// National Parks Service API 
// THIS API IS CURRENTLY IN DEVELOPMENT maybe we can contribute to it sometime
// Preston's API Key VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG

function findParksRelatedTo() {
    var searchTerm = "fly fishing"; // insert user submitted text once we have the DOM element
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
    var requestUrl = 'https://developer.nps.gov/api/v1/events?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
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
        console.log(response);
        
        parkData = response;
        
        sortParkData(response);

        displayResults();
        // console.log(parkData[0].data[0].fullName);
    })
}



// MapQuest API
// example https://www.mapquestapi.com/directions/v2/route?key=KEY&from=Clarendon Blvd,Arlington,VA&to=2400+S+Glebe+Rd,+Arlington,+VA
// another example https://www.mapquestapi.com/staticmap/v5/map?start=New+York,NY&end=Washington,DC&size=600,400@2x&key=KEY
// MapQuest route API gives distance as well as some other stuff
// Michael's API key Q87JNminvctmB5QAimcXQlzSf33AmhqY
function getDirections() {
    var startingPoint = "Houston, TX"; // insert user generated starting point
    var endPoint = "El Paso, TX"; // insert user generated end point
    //var requestUrl = 'https://www.mapquestapi.com/staticmap/v5/map?start=' + startingPoint + '&end='+ endPoint + '&size=600,400@2x&key=Q87JNminvctmB5QAimcXQlzSf33AmhqY';
    var requestUrl = 'https://www.mapquestapi.com/directions/v2/route?key=Q87JNminvctmB5QAimcXQlzSf33AmhqY&from=' + startingPoint + '&to=' + endPoint;
    // var requestUrl = 'https://www.mapquestapi.com/staticmap/v5/map?start=New+York,NY&end=Washington,DC&size=600,400@2x&key=Q87JNminvctmB5QAimcXQlzSf33AmhqY';
    $.ajax({
        url: requestUrl,
        method: 'GET',
    }).then(function (response) {
        // console.log(response);
        routeData = response;
        displayMap(startingPoint, endPoint);
    })
    
}

function displayMap(startPoint, endPoint) {
    L.mapquest.key = 'Q87JNminvctmB5QAimcXQlzSf33AmhqY';

    // 'map' refers to a <div> element with the ID map
    L.mapquest.map('map', {
        center: [37.7749, -122.4194],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
    });

    var directions = L.mapquest.directions();
    directions.route({
        start: startPoint,
        end: endPoint
    });
}

// var dropdown = document.querySelector('.dropdown');
// dropdown.addEventListener('click', function(event) {
//   event.stopPropagation();
//   dropdown.classList.toggle('is-active');
// });

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
    return Math.round(earthRadius * Math.sqrt(Math.pow(deltaPhi,2) + Math.pow(Math.cos(meanLat) * deltaLambda,2)));
}


// sorts the response data and returns the five closest results
function sortParkData(completeResponse) {
    // iterate through the complete response, and calculate distance from user supplied lat / lon. 
    var userLocation = [29.749907, -95.358421]; // Houston coords for now
    for (let i = 0; i < completeResponse.limit; i++) {
      console.log(i)
      var parkCoords = [Number(completeResponse.data[i].latitude), Number(completeResponse.data[i].longitude)];
      var distanceCal = getDistance(userLocation, parkCoords);
      completeResponse.data[i].distance = distanceCal;
    }

    completeResponse.data.sort(compareFn);
    console.log(completeResponse)
    console.log(completeResponse.data)
    parkData = completeResponse;
    function compareFn (a, b) {
        return a.distance - b.distance
    }
}


// Landing Page Button Functionality
// Local storage data for recent searches is going to be pulled from local storage and rendered on user click.

function recentSearch(index){
    var recentData = JSON.parse(localStorage.getItem('searchData'));

}

//Michael - Dynamic HTML generation for results Page 
function displayResults() {
  var resultsColumn = $('#results-column');
    for (i=0; i < 5; i++) {

  var resultItemCard = $('<div>').addClass('card active-border block js-modal-trigger').attr('data-clickable', 'true').attr('data-target', 'location-modal').attr('id', `card${i}`);
  var parkName = $('<p>').addClass('title is-4 ml-2 mt-1').text(parkData.data[i].fullName);
  var parkState = $('<p>').addClass('subtitle is-6 ml-2 mb-2').text(parkData.data[i].states);
  var parkDescription = $('<p>').addClass('ml-2').text(parkData.data[i].description.slice(0, 75)+'...');
  var parkDistance = $('<p>').addClass('ml-2 mb-1 text-center').text('Distance: ' + parkData.data[i].distance + ' mi' );

  resultsColumn.append(resultItemCard);
  resultItemCard.append(
      parkName,
      parkState,
      parkDescription,
      parkDistance
  );  
}
modalLink();
}