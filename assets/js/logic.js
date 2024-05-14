const apiKey = 'dbcbb9c589f4c0f5a4c4b3b1eb796173';
const searchBar = document.querySelector('#search-bar');
const cityTitle = document.querySelector('#city-title');
const cityInfoTitle = document.querySelector('#main-city-name');

let countriesInfo = JSON.parse(localStorage.getItem('allCountries')) || [];
let cityApiName = null;


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
        const cityname = data.city.name;
        return {latitude, longiitude, cityname};
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
    newButton.setAttribute('class', 'button has-background-info-soft city-button');
    
    newButton.innerHTML = cityName;

    menuList.appendChild(newButton);
    blockDiv.appendChild(menuList);

    buttonsContainer.appendChild(blockDiv);
    newButton.addEventListener('click', function(event){
        const cityInfo = countriesInfo.find(country => country.countryName === event.target.innerHTML);
        changeCityInfo(cityInfo);
    }
)
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

function changeCityInfo(cityWeatherInfo){
    const humidMain = document.querySelector('#hum-main');
    const tempMain = document.querySelector('#temp-main');
    const windMain = document.querySelector('#wind-main');
    const dateMain = document.querySelector('#main-date');
    const iconMain = document.querySelector('#main-weather-logo');

    const allButtons = document.querySelectorAll('.city-button')

    deleteCards();

    const cityName = cityWeatherInfo.countryName;

    for(let button_i of allButtons){
        console.log(button_i.innerHTML)
        if(cityName === button_i.innerHTML){
            button_i.setAttribute('class', 'button has-background-link city-button is-active');
        }else{
            button_i.setAttribute('class', 'button has-background-info-soft city-button');
        }
    }

    cityTitle.textContent = `${cityName} Info`;
    cityInfoTitle.textContent = cityName;
    let basicInfo = cityWeatherInfo.info[0];
    const mainIconUrl = `https://openweathermap.org/img/w/${basicInfo.weather[0].icon}.png`;
    const todayVar = dayjs(basicInfo.dt_txt).format('MM/DD/YYYY');
    
    dateMain.innerHTML = `(${todayVar})`;
    cityTitle.textContent = `${cityName} Info`;
    cityInfoTitle.textContent = cityName;
    
    humidMain.textContent = `Humidity : ${basicInfo.main.humidity}%`;
    tempMain.textContent = `Temperature : ${basicInfo.main.temp} °F`;
    windMain.textContent = `Wind : ${basicInfo.wind.speed} MPH`;
    iconMain.setAttribute('src', mainIconUrl);
    iconMain.setAttribute('class', []);

    for (let day_i = 8; day_i < cityWeatherInfo.info.length; day_i += 8){
        basicInfo = cityWeatherInfo.info[day_i];
        createForecastCard(basicInfo);
    }
    
    basicInfo = cityWeatherInfo.info[cityWeatherInfo.info.length - 1];
    createForecastCard(basicInfo);
    
}

function cityNotRepeated(cityInfo){
    let storedCities = JSON.parse(localStorage.getItem('allCountries')) || [];
    let countryisrepeated = false;
    for(let city_i of storedCities){
        if(city_i.countryName === cityInfo){
            countryisrepeated = true;
        };
    };
    
    return countryisrepeated;
}

window.addEventListener('DOMContentLoaded', function(event){
    if(countriesInfo.length>0){
        for (registeredCountry of countriesInfo){
            createHistButton(registeredCountry.countryName);
        }
    }else{
        countriesInfo = [];
    }

    searchBar.addEventListener('keypress', function(enterKey){
        if(enterKey.key === 'Enter'){
            cityNameInput = searchBar.value;
            getGeoInfo(cityNameInput)
            .then(function(coordinates) {
                cityApiName = coordinates.cityname;
                if(!cityNotRepeated(cityApiName)){
                    getWeatherInfo(coordinates)
                    .then(function(data_1){
                        setTimeout(function(){
                            countriesInfo.push({
                                countryName : data_1.city.name,
                                info:data_1.list
                            });
                            localStorage.setItem('allCountries', JSON.stringify(countriesInfo));
                            createHistButton(data_1.city.name);
                            },2000);
                        });
                    }else{    
                        searchBar.value = '';
                    };
                });
            setTimeout(function(){
                countriesInfo = JSON.parse(localStorage.getItem('allCountries'));
                const actInfo = countriesInfo.find(country => country.countryName === cityApiName)
                changeCityInfo(actInfo);
            }, 2500);

            searchBar.value = '';
        };
    });
});