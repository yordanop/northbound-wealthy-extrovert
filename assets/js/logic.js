const apiKey = 'dbcbb9c589f4c0f5a4c4b3b1eb796173'

function getWeatherInfo(coord){
    const apiWeatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.latitude}&lon=${coord.longiitude}&appid=${apiKey}`;
    return fetch(apiWeatherUrl)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
        alert(`Error:${response.statusText}`);
        }
    })
    .then(function(data) {
        return data; 
        console.log(data);
    })
    .catch(function (error) {
        alert('Unable to connect Weather API');
    });
}

function getGeoInfo(cityName){
    const apiWeatherGeoUrl = `https://api.openweathermap.org/data/2.5/forecast?q=London&appid=${apiKey}`;
    return fetch(apiWeatherGeoUrl)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }else {
            alert(`Error:${response.statusText}`);
        }
    })
    .then(function (data) {
        const latitude = data.city.coord.lat;
        const longiitude = data.city.coord.lon;
        return {latitude, longiitude};
        })
    .catch(function (error) {
        alert('Unable to connect Geolatitude API');
    });
}

// getGeoInfo('London')
//     .then(function(coordinates) {
//         getWeatherInfo(coordinates)
//             .then(function(data_1){
//                 console.log(data_1)
//             });
//         });

window.addEventListener('DOMContentLoaded', function(event){
    const searchBar = document.querySelector('#search-bar');
    
    searchBar.addEventListener('keypress', function(enterKey){
        if(enterKey.key === 'Enter'){
            console.log(searchBar.value);
            searchBar.value = '';
        }
    })
})