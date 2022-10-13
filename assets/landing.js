// initialize global variables
var userLocation = "";
var userSearch = "";
var recentSearches = {
  locations: [],
  searches: []
};

onLoad();

function onLoad() {
  modalLink();
  // Launching location modal on page load
  $(document).ready(function () {
    $("#location-modal").addClass("is-active");
  });
  $('#submit-search').on('click', updateUS);
  $('#updateBtn').on('click', updateUL);
  displayBackgroundImage();
  loadLocalStorage();
  loadRecents();
}

function loadLocalStorage() {

   // if there exists some localstorage, assign the value of the search history to it
    // if not, create an empty one
  if (JSON.parse(localStorage.getItem('userLocation'))){
    userLocation = JSON.parse(localStorage.getItem('userLocation'));
  }
  else{
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
  }

  if (JSON.parse(localStorage.getItem('userSearch'))) {
    userSearch = JSON.parse(localStorage.getItem('userSearch'));
  } 
  else {
    localStorage.setItem('userSearch', JSON.stringify(userSearch));
  }

  if (JSON.parse(localStorage.getItem('recentSearches'))) {
    recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
  } 
  else {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }
}

// function loadRecents(userSearch.locations.length){
//   i = 0
//   for(var i = 0; i < recentSearches.locations.length; i++){
//     // $('#recent'+i).text(recentSearches.searches[i],"in ",recentSearches.locations[i]);
//     $("'#recent'+i").removeAttr('disabled');
//     console.log('#recent'+ i);
//   }
// }

// Validation for 

function getLatLon() {
  var searchTerm = "Houston, TX";
  var requestUrl = 'http://www.mapquestapi.com/geocoding/v1/address?key=Q87JNminvctmB5QAimcXQlzSf33AmhqY&location=' + searchTerm;
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response) {
    locationData = response.results[0].locations[0].latLng;
    console.log(locationData);
  })
}

// Landing Page Button Functionality
// Local storage data for recent searches is going to be pulled from local storage and rendered on user click.

function recentSearch(index) {
userLocation = recentSearches.locations[index];
userSearch = recentSearches.searches[index];

localStorage.setItem('userSearch', JSON.stringify(userSearch));
localStorage.setItem('userLocation', JSON.stringify(userLocation));
window.location.assign('./results_page.html');
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
  console.log(backgroundImage);
  $('body').css('background-image', 'url(' + backgroundImage + ')');
}

//Michael - Dynamic HTML generation for results Page 

function catchBadInput(){
  $('.errorModal').addClass('is-active')
}

function updateUS() {
  if(userSearch = $('#search-bar').val() === "" || $('#startCity').val() === "" || $('#startState') === ""){
    catchBadInput();
    return null;
  }

  userSearch = $('#search-bar').val();
  localStorage.setItem('userSearch', JSON.stringify(userSearch));

  if(recentSearches.locations.length < 3 && recentSearches.searches.length < 3){
    
    recentSearches.locations.push(userLocation);
    recentSearches.searches.push(userSearch);
    console.log(recentSearches);
  }
  else{

    recentSearches.locations = recentSearches.locations.slice(1);
    recentSearches.searches = recentSearches.searches.slice(1);

    recentSearches.locations.push(userLocation);
    recentSearches.searches.push(userSearch);

    console.log(recentSearches);
  }
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
//   window.location.assign('./results_page.html');
}

function updateUL() {
  userLocation = $('#startCity').val() + ', ' + $('#startState').val();
  localStorage.setItem('userLocation', JSON.stringify(userLocation));
}





