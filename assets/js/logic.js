const apiKey = 'dbcbb9c589f4c0f5a4c4b3b1eb796173';
const searchBar = document.querySelector('#search-bar');
const cityTitle = document.querySelector('#city-title');
const cityInfoTitle = document.querySelector('#main-city-name');

let countriesInfo = JSON.parse(localStorage.getItem('allCountries')) || [];


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
    })
    .catch(function (error) {
        alert('Unable to connect Weather API');
    });
}

function getGeoInfo(cityName){
    const apiWeatherGeoUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;
    return fetch(apiWeatherGeoUrl)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }else {
            alert(`Country ${response.statusText}`);
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

function createHistButton(cityName){
    const buttonsContainer = document.querySelector('#history-container')
    const blockDiv = document.createElement('div');
    const menuList = document.createElement('li');
    const newButton = document.createElement('button');

    blockDiv.setAttribute('class', 'block');
    newButton.setAttribute('class', 'button has-background-info-soft');
    newButton.innerHTML = cityName;

    menuList.appendChild(newButton);
    blockDiv.appendChild(menuList);

    buttonsContainer.appendChild(blockDiv);
}

window.addEventListener('DOMContentLoaded', function(event){
    const humidMain = document.querySelector('#hum-main');
    const tempMain = document.querySelector('#temp-main');
    const windMain = document.querySelector('#wind-main');
    const dateMain = this.document.querySelector('#main-date');

    // searchBar.addEventListener('keypress', function(enterKey){
    //     cityNameInput = searchBar.value;
        
        // if(enterKey.key === 'Enter'){
        //     getGeoInfo(cityNameInput)
        //         .then(function(coordinates) {
        //                 if(coordinates !== undefined){
        //                         getWeatherInfo(coordinates)
        //                     .then(function(data_1){

        //                         let nameData = data_1.city.name;
            
        //                         countriesInfo.push({
        //                             countryName : nameData,
        //                             info:data_1.list
        //                         });
            
        //                         localStorage.setItem('allCountries', JSON.stringify(countriesInfo));
        //                         cityTitle.textContent = `${nameData} Info`;
        //                         cityInfoTitle.textContent = nameData;                                                    
        //                     }
        //                 );
        //             }else{
        //                 searchBar.value = '';
        //             }
        //         }
        //     );
            
        //     searchBar.value = '';
        // }


        
    // })
    let data_1 = JSON.parse(localStorage.getItem('allCountries'))[0];
    let nameData = data_1.countryName;
    let basicInfo = data_1.info[0];
    const todayVar = dayjs(basicInfo.dt_text).format('MM/DD/YYYY');
    
    dateMain.innerHTML = `(${todayVar})`;
    cityTitle.textContent = `${nameData} Info`;
    cityInfoTitle.textContent = nameData;

    humidMain.textContent = `Humidity : ${basicInfo.main.humidity}%`;
    tempMain.textContent = `Temperature : ${basicInfo.main.temp} °F`;
    windMain.textContent = `Wind : ${basicInfo.wind.speed} MPH`;


    for (let day_i = 8; day_i < data_1.info.length; day_i += 8){
        basicInfo = data_1.info[day_i];
        createForecastCard(basicInfo);
    }

})