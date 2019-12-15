// Initialize app
var myApp = new Framework7();


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page
    myApp.alert('Here comes About page');

})
myApp.onPageInit('weather', function (page) {
    // Do something here for "about" page
    checkWeather();

})

window.onload = function () {
    this.getLocation();
};

//getLocation()
var x = document.getElementById("location");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
    else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
var latPos = "";
var lat = "";
function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    displayLocation(lat, lon);
    latPos = lat + "," + lon;
    console.log("the pos is : ", latPos);

}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}
var city;
var latlng = "";
function displayLocation(latitude, longitude) {
    var geocoder;
    geocoder = new google.maps.Geocoder();
    latlng = new google.maps.LatLng(latitude, longitude);

    geocoder.geocode(
        { 'latLng': latlng },
        function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    var add = results[0].formatted_address;
                    var value = add.split(",");
                    console.log(results);

                    count = value.length;
                    country = value[count - 1];
                    state = value[count - 2];
                    city = value[count - 3];
                    x.innerHTML = city
                        + ", " + state + ", " + country;
                }
                else {
                    x.innerHTML = "address not found";
                }
            }
            else {
                x.innerHTML = "Geocoder failed due to: " + status;
            }
        }
    );
}

document.getElementById("getLocation").addEventListener("click", getLocation);
document.getElementById("getWeather").addEventListener("click", checkWeather);


function getCity() {

    navigator.geolocation.getCurrentPosition(geoCallback, onError);

    function geoCallback(position) {
        var latitude = position.coords.latitude;
        console.log(latitude);
        var longitude = position.coords.longitude;
        console.log(longitude);
        var latlong = latitude + "," + longitude;
        console.log(latlong);

    }
    function onError(message) {
        alert('Failed because: ' + message);
    }

    var http = new XMLHttpRequest();
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=53.27,-6.35&key=AIzaSyC9hm7kwPwGp6vACePsnVYeqaUEvx6mKUc';
    var query_string = url.search;
    var search_params = new URLSearchParams(query_string);
    search_params.set('latlng', latlng);
    url.search = search_params.toString();
    var new_url = url.toString();
    console.log(new_url);

    http.open('GET', new_url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        var responseJSON = JSON.parse(response);
        var responseCity = responseJSON.results["0"].address_components[2].short_name;
        console.log(responseJSON);
        //console.log(responseJSON);
        document.getElementById('location').innerHTML = responseCity;

        //var responseCity = responseJSON.city;
        // console.log(responseCity);

        //document.getElementById('location').innerHTML = responseCity;

    }
}

function checkWeather() {
    var http = new XMLHttpRequest();
    var url = 'http://api.openweathermap.org/data/2.5/weather?lat=53&lon=-7&appid=2cd730b86a546cea34483fe446c3469d&units=metric';
    var new_url = setUrlParameter(url, 'lat', lat);
    new_url = setUrlParameter(new_url, 'lon', lon);
    

    http.open('GET', new_url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        var responseJSON = JSON.parse(response);

        console.log(new_url);
        console.log(responseJSON);
        console.log(responseJSON.weather["0"].description);
        document.getElementById('weatherStat').innerHTML = + responseJSON.main.temp + " °C"
        document.getElementById('weatherExt').innerHTML = "<br><br>" +responseJSON.weather["0"].description + " expected today ";
        document.getElementById('weatherExt2').innerHTML = "<br><br> Feels like : " + responseJSON.main.feels_like + " °C";

    }
}
/* Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})*/
var testing = '2345';
function showlat() {
    console.log(lat, lon);

}

// Currency page
//list



function userInput() {

    var str = document.getElementById("ammount").value;
    console.log(str);

    var currencySelect = document.getElementById("currencyList").value;
    console.log(currencySelect);

    var http = new XMLHttpRequest();
    var url = 'https://api.exchangeratesapi.io/latest?base=EUR';

    var new_url = setUrlParameter(url, 'base', currencySelect);

    console.log(new_url);
    
    http.open('GET', new_url);
    http.send();
    http.onreadystatechange = (e) => {
        var response = http.responseText;
        var responseJSON = JSON.parse(response);

        var responseCur = responseJSON.rates.USD;
        console.log(responseCur);
        var resultCur = str * responseCur;
        document.getElementById('result').innerHTML = str + " " +currencySelect + " :<br> " +resultCur + " Dollars";
    }

}

function userInput2()
{
    var str = document.getElementById("ammount2").value;
    console.log(str);

    var currencySelect = document.getElementById("currencyList2").value;
    console.log(currencySelect);

    var http = new XMLHttpRequest();
    const url = 'http://apilayer.net/api/live?access_key=69476a06b475ef54924513180d559281&currencies=EUR&source=USD&format=1';

    var new_url = setUrlParameter(url,'currencies', currencySelect );
    console.log(new_url)
    http.open('GET', new_url);
http.send();
http.onreadystatechange = (e) => {
		var response = http.responseText;
        var responseJSON = JSON.parse(response); 
       

    //var responseCur = "responseJSON.quotes.USD" + currencySelect;
    newCur = "USD"+currencySelect;
    console.log(newCur);

    var responseCur = responseJSON.quotes[newCur];

    var resultCur = str*responseCur;

        document.getElementById('result2').innerHTML =str +" Dollars : <br>"+
        resultCur + " " + currencySelect;

    


}


}

function setUrlParameter(url, key, value) {
    var key = encodeURIComponent(key),
        value = encodeURIComponent(value);

    var baseUrl = url.split('?')[0],
        newParam = key + '=' + value,
        params = '?' + newParam;

    if (url.split('?')[1] === undefined){ // if there are no query strings, make urlQueryString empty
        urlQueryString = '';
    } else {
        urlQueryString = '?' + url.split('?')[1];
    }

    // If the "search" string exists, then build params from it
    if (urlQueryString) {
        var updateRegex = new RegExp('([\?&])' + key + '[^&]*');
        var removeRegex = new RegExp('([\?&])' + key + '=[^&;]+[&;]?');

        if (value === undefined || value === null || value === '') { // Remove param if value is empty
            params = urlQueryString.replace(removeRegex, "$1");
            params = params.replace(/[&;]$/, "");
            
        } else if (urlQueryString.match(updateRegex) !== null) { // If param exists already, update it
            params = urlQueryString.replace(updateRegex, "$1" + newParam);
            
        } else if (urlQueryString == '') { // If there are no query strings
            params = '?' + newParam;
        } else { // Otherwise, add it to end of query string
            params = urlQueryString + '&' + newParam;
        }
    }

    // no parameter was set so we don't need the question mark
    params = params === '?' ? '' : params;

    return baseUrl + params;
}
