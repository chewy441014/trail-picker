// initialize global variables
var userLocation = "";
var userSearch = "";
var recentSearches = {
  locations: [],
  searches: []
};
var i = 0;

onLoad();

function onLoad() {
  modalLink();
  $('#submit-search').on('click', updateUS);
  $('#updateBtn').on('click', updateUL);
  displayBackgroundImage();
  loadLocalStorage();
  loadRecents();
}

function loadLocalStorage() {

  // if there exists some localstorage, assign the value of the search history to it
  // if not, create an empty one
  if (JSON.parse(localStorage.getItem('userLocation'))) {
    userLocation = JSON.parse(localStorage.getItem('userLocation'));
  }
  else {
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

function loadRecents() {

  for (var i = 0; i < recentSearches.locations.length; i++) {

    $(`#recent${i}`).text(recentSearches.searches[i] + " in " + recentSearches.locations[i]);
    $(`#recent${i}`).css('display', 'inline');

  }
}

// Validation for user inputs

function getLatLon(searchTerm) {
  console.log(searchTerm);
  var requestUrl = 'https://www.mapquestapi.com/geocoding/v1/address?key=Q87JNminvctmB5QAimcXQlzSf33AmhqY&location=' + searchTerm;
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response) {
    var locationData = response;
    console.log(locationData);
    if (Object.is(locationData, undefined) || locationData.results.length === 0) {
      console.log("Location search invalid")
      catchBadInput()
    }
    else {
      console.log("Location search ok")
      // Modal is opened to select location results from the api (for validation reasons)
      // create and add buttons for the first five elements of locationData if they exist
      var displayLength = Math.min(5, locationData.results.length)
        
        for (var i = 0; i < displayLength; i++) {
          var newLi = $("<li>");
          var newButton = $("<button>");
          newButton.addClass("button is-info is-outlined");
          newButton.on("click", changeLoc); // point to the function that starts the validation for the search term
          newButton.text(locationData.results[0].locations[i].adminArea5 + ", " + locationData.results[0].locations[i].adminArea3);
          newLi.append(newButton);
          newButton.attr('id', `choice${i}`)
          $('#button-container').append(newLi);
        }
        $('.validationModal').addClass('is-active');
    }
  });
}

function changeLoc(e){
  // User presses buttons presented in the validation modal
  // text is pulled from the specific button that was pressed
  // text is saved over the user input location (is validated at this point)
  // text is saved to local storage
  // modal is closed
  userLocation = $(e.target).text();
  localStorage.setItem('userLocation', JSON.stringify(userLocation));
  $('#button-container').empty();
  $('.validationModal').removeClass('is-active');
  findParksRelatedTo(userSearch);
}

function findParksRelatedTo(searchTerm) {
  console.log(searchTerm);
  var requestUrl = 'https://developer.nps.gov/api/v1/parks?q=' + searchTerm + '&api_key=VsW5K0iIIgUoBLJJejWXL1qmtDOOnKKy7fx22tfG';
  $.ajax({
    url: requestUrl,
    method: 'GET',
  }).then(function (response) {
    var parkData = response;
    console.log(parkData);
    if (Object.is(parkData, undefined) || parkData.data.length === 0) {
      console.log("Park search invalid")
      catchBadInput()
    } else {
      console.log("Park search ok")
      saveRotateSearch()
      window.location.assign('./results_page.html');
    }
  });
}

// Landing Page Button Functionality
// Local storage data for recent searches is going to be pulled from local storage and rendered on user click.

function recentSearch(index) {
  userLocation = recentSearches.locations[index];
  userSearch = recentSearches.searches[index];

  localStorage.setItem('userSearch', JSON.stringify(userSearch));
  localStorage.setItem('userLocation', JSON.stringify(userLocation));

  getLatLon(userLocation, userSearch);
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

function catchBadInput() {
  $('.errorModal').addClass('is-active')
}

function updateUS() {
  if (userSearch = $('#search-bar').val() === "" || $('#startCity').val() === "" || $('#startState') === "") {
    catchBadInput();
    return null;
  }

  userSearch = $('#search-bar').val();
  localStorage.setItem('userSearch', JSON.stringify(userSearch));
  console.log('validating responses... ');
  getLatLon(userLocation)
}

function saveRotateSearch() {
  if (recentSearches.locations.length < 3 && recentSearches.searches.length < 3) {

    recentSearches.locations.push(userLocation);
    recentSearches.searches.push(userSearch);
    console.log(recentSearches);
  }
  else {

    recentSearches.locations = recentSearches.locations.slice(1);
    recentSearches.searches = recentSearches.searches.slice(1);

    recentSearches.locations.push(userLocation);
    recentSearches.searches.push(userSearch);

    console.log(recentSearches);
  }
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches));


}

function updateUL() {
  userLocation = $('#startCity').val() + ', ' + $('#startState').val();
}





