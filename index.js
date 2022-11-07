var citySearch = document.querySelector("#citySearch");
var submitButton = document.querySelector("#button");
var cards = document.querySelector('#cardContainer');
var today = document.querySelector('#today');
var icon = document.querySelector('#icon');
var cityList = document.querySelector('#cityList');
var rightSide = document.querySelector('#right');

submitButton.addEventListener("click", cityToLatLong);
cityList.addEventListener('click', asideLatLong);

var searchedCities = [];
var storage = JSON.parse(localStorage.getItem("searchedCities"));

//excecutes if there's local data, inserting search history and loading the info for the first searched city (I know I could probably make it the most recent but I'm lazy lol)
if (storage != null) {
    for (i=0; i<storage.length; i++) {
        var newCity = document.createElement("li"); 
        searchedCities.push(storage[i]);
        cityList.appendChild(newCity);
        newCity.innerHTML = storage[i];
        startUp();
        rightSide.style.visibility = 'visible'
    }
}

//note: latitude and longitude are needed to get city info based off how the api works
//latitude longitude retrieval based off search history
function asideLatLong(event) {
    var city = event.target.innerHTML
    var request = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=1c12361665302a49d248b1afb6489a6f"
    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            Find(latitude, longitude);
        })
}

//latitude longitude retrieval based off user input, then adds city to search history if it is not already in the search history
function cityToLatLong(event) {
    var city = citySearch.value
    var request = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=1c12361665302a49d248b1afb6489a6f"
    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            Find(latitude, longitude);
            rightSide.style.visibility = 'visible'
            city = city.toLowerCase();
            if (searchedCities.includes(city) === false) {
                var newCity = document.createElement("li"); 
                searchedCities.push(city);
                cityList.appendChild(newCity);
                newCity.innerHTML = data[0].name;
                localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
            }
            citySearch.value = ""
        })
}

//gets api responses for the 5 day forcast and for today.
function Find(latitude, longitude) {
    var requestURL = 'http://api.openweathermap.org/data/2.5/forecast?lat='+latitude+'&lon='+longitude+'&appid=1c12361665302a49d248b1afb6489a6f'
    var currentRequestURL = 'https://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&appid=1c12361665302a49d248b1afb6489a6f'
    fetch(requestURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){         
            dataFill(data);
        })
    fetch(currentRequestURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            todayDate(data);
        })
    
}

//inserts data for today
function todayDate(data) {
    today.children[0].innerHTML = data.name+": " +moment().format("dddd, MMM Do");
    today.children[2].innerHTML = 'Temp: ' + Math.floor(1.8*(data.main.temp-273) + 32) + ' °F';
    today.children[3].innerHTML = 'Wind: ' + data.wind.speed + ' MPH';
    today.children[4].innerHTML = 'Humidity: ' + data.main.humidity + '%';
    icon.src = 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
}

//inserts data for 5 day forecast
function dataFill(data) {
    for(var i=0; i<5; i++) {
        currentChild = cards.children[i];
        currentChild.children[0].innerHTML = data.list[(i*8)].dt_txt;
        currentChild.children[0].innerHTML = moment().add((i+1), 'days').format("dddd, MMM Do")
        currentChild.children[1].src = 'http://openweathermap.org/img/w/'+data.list[(i*8)].weather[0].icon+'.png'
        currentChild.children[2].innerHTML = 'Temp: ' + Math.floor(1.8*(data.list[(i*8)].main.temp-273) + 32) + ' °F';
        currentChild.children[3].innerHTML = 'Wind: ' + data.list[(i*8)].wind.speed + ' MPH';
        currentChild.children[4].innerHTML = 'Humidity: ' + data.list[(i*8)].main.humidity + '%';
    }
}

//defaults page to load info for first item in search history
function startUp(event) {
    var city = storage[0]
    var request = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&appid=1c12361665302a49d248b1afb6489a6f"
    fetch(request)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            var latitude = data[0].lat;
            var longitude = data[0].lon;
            Find(latitude, longitude);
            citySearch.value = ""
        })
}