// Initialize the app when DOM is loaded

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for Enter key in city input
    var cityInput = document.getElementById('city');
    var suggestionsDiv = document.getElementById('city-suggestions');
    const API_KEY = '601673328b16cd6b73bb8cdbf6526cc9';

    if (cityInput) {
        cityInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const city = cityInput.value.split(',')[0].trim();
                cityInput.value = city;
                getWeather();
                suggestionsDiv.innerHTML = '';
            }
        });

        cityInput.addEventListener('input', function(e) {
            const query = cityInput.value.trim();
            if (query.length < 2) {
                suggestionsDiv.innerHTML = '';
                return;
            }
            // Fetch city suggestions from OpenWeatherMap Geocoding API
            fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`)
                .then(response => response.json())
                .then(data => {
                    suggestionsDiv.innerHTML = '';
                    if (Array.isArray(data) && data.length > 0) {
                        data.forEach(cityObj => {
                            const suggestion = document.createElement('div');
                            suggestion.className = 'suggestion-item';
                            const fullText = `${cityObj.name}${cityObj.state ? ', ' + cityObj.state : ''}, ${cityObj.country}`;
                            suggestion.textContent = fullText;
                            suggestion.addEventListener('mousedown', function() {
                                cityInput.value = fullText;
                                suggestionsDiv.innerHTML = '';
                            });
                            suggestionsDiv.appendChild(suggestion);
                            
                            
                        });
                    }
                })
                .catch(() => {
                    suggestionsDiv.innerHTML = '';
                });
        });
    }
});

function getWeather() {
    const API_KEY = '601673328b16cd6b73bb8cdbf6526cc9';
    var cityInput = document.getElementById('city');
    if (!cityInput) {
        alert("Please enter a city");
        return;
    }
    // Always use only the city name (before the first comma)
    const city = cityInput.value.split(',')[0].trim();

    if (!city) {
        alert("Please enter a city");
        return;
    }

    // Show clear button when city is entered
    var clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = 'inline-block';
    }

    const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

    fetch(currentWeatherURL)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            console.log(data);
        })
        .catch(error => {
            console.log('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
            console.log(data);
        })
        .catch(error => {
            console.log('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

// Clear button functionality
function clearWeather() {
    document.getElementById('city').value = '';
    document.getElementById('temp-div').innerHTML = '';
    document.getElementById('weather-info').innerHTML = '';
    document.getElementById('weather-icon').src = '';
    document.getElementById('weather-icon').alt = '';
    document.getElementById('hourly-forecast').innerHTML = '';
    document.getElementById('weather-icon').style.display = 'none';
    var clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
}

function displayWeather(data) {

    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    //clear previous data
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';
    weatherIcon.src = '';
    hourlyForecastDiv.innerHTML = '';

    if(data.cod === '404'){
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
        tempDivInfo.innerHTML = '';
        weatherInfoDiv.innerHTML = '';
        weatherIcon.src = '';
        hourlyForecastDiv.innerHTML = '';
        var clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    } else {
        // Display weather information
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `
        <p>${temperature} °C</p>
        `;

        const weatherHTML = `
        <p>${cityName}</p>
        <p>${description}</p>
        `;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();

    }
}


function displayHourlyForecast(hourlyData){

    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8); // Get next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const description = item.weather[0].description;
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const hourlyitemHTML = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="${description}">
                <span>${temperature} °C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyitemHTML;
    })

}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
    if (weatherIcon) {
        weatherIcon.style.display = 'block';
    }
}