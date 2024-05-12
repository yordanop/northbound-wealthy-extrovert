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

function createForecastCard(dayInfo){
    const cardsContainer = document.querySelector('#next-days');

    const cardContainer = document.createElement('div');
    const dayContainer = document.createElement('h3');
    const iconContainer = document.createElement('img');
    const humidContainer = document.createElement('p');
    const windContainer = document.createElement('p');
    const tempContainer = document.createElement('p');
    
    
    const dayBlock = document.createElement('div');
    const iconBlock = document.createElement('div');
    const humidBlock = document.createElement('div');
    const windBlock = document.createElement('div');
    const tempBlock = document.createElement('div');

    const cardElements = [dayBlock, iconBlock, tempBlock, windBlock, humidBlock];
    
    const nextDay = dayjs(dayInfo.dt_txt).format('MM/DD/YYYY');
    const iconUrl = `https://openweathermap.org/img/w/${dayInfo.weather[0].icon}.png`;
    
    
    for(let element_i of cardElements){
        element_i.setAttribute('class', 'block')
    }

    cardContainer.setAttribute('class', 'card column m-3 fcst-card');
    dayContainer.setAttribute('class', 'subtitle is-4');

    dayContainer.innerHTML = `(${nextDay})`;

    humidContainer.textContent = `Humidity : ${dayInfo.main.humidity}%`;
    tempContainer.textContent = `Temp : ${dayInfo.main.temp} °F`;
    windContainer.textContent = `Wind : ${dayInfo.wind.speed} MPH`;
    iconContainer.setAttribute('src', iconUrl);
    iconContainer.setAttribute('alt', 'weather icon');

    dayBlock.appendChild(dayContainer);
    iconBlock.appendChild(iconContainer);
    humidBlock.appendChild(humidContainer);
    windBlock.appendChild(windContainer);
    tempBlock.appendChild(tempContainer);

    for(block_i of cardElements){
        cardContainer.appendChild(block_i);    
    }

    cardsContainer.appendChild(cardContainer);

}


function deleteCards(){
    const fcstContainer = document.querySelectorAll('.fcst-card');

    for(let card_i of fcstContainer){
        card_i.remove();
    }
}

function changeCityInfo(cityName, cityWeatherInfo){
    const humidMain = document.querySelector('#hum-main');
    const tempMain = document.querySelector('#temp-main');
    const windMain = document.querySelector('#wind-main');
    const dateMain = document.querySelector('#main-date');
    const iconMain = document.querySelector('#main-weather-logo');

    deleteCards();
    
    cityTitle.textContent = `${cityName} Info`;
    cityInfoTitle.textContent = cityName;
    
    let basicInfo = cityWeatherInfo[0];
    const mainIconUrl = `https://openweathermap.org/img/w/${basicInfo.weather[0].icon}.png`;
    const todayVar = dayjs(basicInfo.dt_txt).format('MM/DD/YYYY');
    
    dateMain.innerHTML = `(${todayVar})`;
    cityTitle.textContent = `${cityName} Info`;
    cityInfoTitle.textContent = cityName;
    
    humidMain.textContent = `Humidity : ${basicInfo.main.humidity}%`;
    tempMain.textContent = `Temperature : ${basicInfo.main.temp} °F`;
    windMain.textContent = `Wind : ${basicInfo.wind.speed} MPH`;
    iconMain.setAttribute('src', mainIconUrl);
    
    for (let day_i = 8; day_i < cityWeatherInfo.length; day_i += 8){
        basicInfo = cityWeatherInfo[day_i];
        createForecastCard(basicInfo);
    }
    
    basicInfo = cityWeatherInfo[cityWeatherInfo.length - 1];
    createForecastCard(basicInfo);
    createHistButton(cityName);
}



window.addEventListener('DOMContentLoaded', function(event){

    searchBar.addEventListener('keypress', function(enterKey){
        cityNameInput = searchBar.value;
        
        if(enterKey.key === 'Enter'){
            getGeoInfo(cityNameInput)
                .then(function(coordinates) {
                        if(coordinates !== undefined){
                                getWeatherInfo(coordinates)
                            .then(function(data_1){

                                setTimeout(function(){
                                    countriesInfo.push({
                                        countryName : nameData,
                                        info:data_1.list
                                    });
                                    
                                    localStorage.setItem('allCountries', JSON.stringify(countriesInfo));
                                },1000);
                                let nameData = data_1.city.name;
                                changeCityInfo(nameData, data_1.list);
                            }
                        );
                    }else{
                        searchBar.value = '';
                    }
                }
            );
            searchBar.value = '';
        }
    })
    

})