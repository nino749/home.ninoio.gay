const waterContainer = document.getElementById('water-container');
const pinList = document.getElementById("pin-list");
const cityInput = document.getElementById("city-input");
const pinSection = document.getElementById("pinned-section");
const editBtn = document.getElementById("edit-pins-button");
let isEditingPins = false;

function loadPins() {
    const pins = JSON.parse(localStorage.getItem("pinnedCities") || "[]");
    pinList.innerHTML = "";

    if (pins.length === 0) {
        pinSection.classList.remove("show");
        editBtn.classList.remove("show");
        setTimeout(() => {
            pinSection.style.display = "none";
        }, 400);
        return;
    }

    pinSection.style.display = "block";

    setTimeout(() => {
        pinSection.classList.add("show");
        editBtn.classList.add("show");
    }, 50);
    pins.forEach((city, index) => {
        const cityButton = document.createElement("div");
        cityButton.className = "pin-button-style";
        cityButton.textContent = city;
        
        cityButton.style.animationDelay = `${0.1 + (index * 0.1)}s`;

        cityButton.onclick = () => {
            if (isEditingPins) {
                removePin(city);
            }
        };

        pinList.appendChild(cityButton);
    });
}

function addPin(city) {
    let pins = JSON.parse(localStorage.getItem("pinnedCities") || "[]");
    if (!pins.includes(city)) {
        pins.push(city);
        localStorage.setItem("pinnedCities", JSON.stringify(pins));
        loadPins();
    }
}

function removePin(city) {
    let pins = JSON.parse(localStorage.getItem("pinnedCities") || "[]");
    pins = pins.filter(c => c !== city);
    localStorage.setItem("pinnedCities", JSON.stringify(pins));
    loadPins();
}


function toggleEditMode() {
    isEditingPins = !isEditingPins;
    editBtn.innerHTML = isEditingPins ? "✔" : "🗑️";
    if (isEditingPins) {
        editBtn.style.backgroundColor = "rgba(245, 94, 94, 0.3)";
        editBtn.style.borderColor = "rgba(245, 94, 94, 0.8)";
    } else {
        editBtn.style.backgroundColor = "rgba(245, 94, 94, 0.1)";
        editBtn.style.borderColor = "rgba(245, 94, 94, 0.3)";
    }
}

window.addEventListener("DOMContentLoaded", () => {
    loadPins();

    const currentCity = "{{ weather_data.location }}";
    if (currentCity) {
        const pinBtn = document.createElement("button");
        pinBtn.className = "pin-button";
        pinBtn.dataset.city = currentCity;
        
        const pins = JSON.parse(localStorage.getItem("pinnedCities") || "[]");
        const isAlreadyPinned = pins.includes(currentCity);
        
        if (isAlreadyPinned) {
            pinBtn.textContent = "";
            pinBtn.classList.add("pinned");
        } else {
            pinBtn.textContent = "";
        }
        
        pinBtn.onclick = () => {
            if (isAlreadyPinned) {
                removePin(currentCity);
                pinBtn.style.transform = "translateY(0) scale(0.9)";
                setTimeout(() => {
                    pinBtn.style.transform = "";
                }, 150);
            } else {
                addPin(currentCity);
                pinBtn.style.transform = "translateY(-2px) scale(1.1)";
                setTimeout(() => {
                    pinBtn.style.transform = "";
                }, 200);
            }
            isAlreadyPinned = !isAlreadyPinned; 
        };
        document.querySelector(".weather-app").appendChild(pinBtn);
    }
});

function toggleDropdown() {
    const menu = document.getElementById('dropdown-menu');
    menu.classList.toggle('show');
}

window.addEventListener('click', function(e) {
    const menu = document.getElementById('dropdown-menu');
    const button = document.querySelector('.menu-button');
    if (!menu.contains(e.target) && !button.contains(e.target)) {
        menu.classList.remove('show');
    }
});

let rainTimer;
let lightningTimer;
let waterLevelTimer;
let currentWeather = 'sunny';

function createRaindrops() {
    const rainEffect = document.getElementById('rain-effect');
    rainEffect.innerHTML = '';

    for (let i = 0; i < 150; i++) {
        const drop = document.createElement('div');
        drop.className = 'raindrop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
        drop.style.animationDelay = Math.random() * 2 + 's';
        rainEffect.appendChild(drop);
    }
}

function createScreenDrops() {
    const screenDrops = document.getElementById('screen-drops');
    screenDrops.innerHTML = '';

    for (let i = 0; i < 20; i++) {
        const drop = document.createElement('div');
        drop.className = 'screen-drop';
        drop.style.left = Math.random() * 100 + '%';
        drop.style.top = Math.random() * 70 + '%';
        drop.style.animationDelay = Math.random() * 3 + 's';
        screenDrops.appendChild(drop);
    }
}

function triggerLightning() {
    const lightning = document.getElementById('lightning');
    lightning.classList.add('flash');
    setTimeout(() => {
        lightning.classList.remove('flash');
    }, 300);
}

function activateWaterWaves() {
    waterContainer.classList.add('active-waves'); 
}

function deactivateWaterWaves() {
    waterContainer.classList.remove('active-waves');
}

function animateWaterLevel() {
    const waterLevel = document.getElementById('water-level');
    let currentHeight = 10;
    const maxHeight = 200;

    const fillWater = setInterval(() => {
        currentHeight += 2;
        waterLevel.style.height = currentHeight + 'px';

        if (currentHeight >= maxHeight) {
            clearInterval(fillWater);
        }
    }, 100);
}

function activateRainScene() {
    deactivateAllScenes();
    document.getElementById('rain-background').classList.add('active');
    document.getElementById('rain-effect').classList.add('active');
    document.getElementById('screen-drops').classList.add('active');

    activateWaterWaves(); 

    createRaindrops();
    createScreenDrops();

    lightningTimer = setInterval(() => {
        if (Math.random() < 0.3) {
            triggerLightning();
        }
    }, 3000);
}

function activateSunnyScene() {
    deactivateAllScenes();
    document.getElementById('sunny-background').classList.add('active');
}

function deactivateAllScenes() {
    const allScenes = document.querySelectorAll(
        '.background-scene, .rain-background, .cloudy-background, .fog-background, .snow-background, .freezing-background, .thunderstorm-background'
    );
    allScenes.forEach(scene => scene.classList.remove('active'));

    document.getElementById('rain-effect')?.classList.remove('active');
    document.getElementById('screen-drops')?.classList.remove('active');

    deactivateWaterWaves();

    if (lightningTimer) clearInterval(lightningTimer);
}

function activateScene(bgId) {
    deactivateAllScenes();

    const el = document.getElementById(bgId);
    if (el) el.classList.add('active');

    if (bgId === "rain-background" || bgId === "thunderstorm-background") {
        activateRainScene();
    } else if (bgId === "sunny-background") {
        activateSunnyScene();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const bgId = "{{ weather_data.bg }}";
    if (bgId) {
        activateScene(bgId);
    }
})






// Weather code mapping
const weatherCodes = {
    0: { desc: "Clear sky", bg: "sunny-background", emoji: "☀️" },
    1: { desc: "Mainly clear", bg: "sunny-background", emoji: "🌤️" },
    2: { desc: "Partly cloudy", bg: "cloudy-background", emoji: "⛅" },
    3: { desc: "Overcast", bg: "cloudy-background", emoji: "☁️" },
    45: { desc: "Fog", bg: "fog-background", emoji: "🌫️" },
    48: { desc: "Depositing rime fog", bg: "fog-background", emoji: "🌫️" },
    51: { desc: "Light Drizzle", bg: "rain-background", emoji: "🌦️" },
    53: { desc: "Moderate Drizzle", bg: "rain-background", emoji: "🌧️" },
    55: { desc: "Dense Drizzle", bg: "rain-background", emoji: "🌧️" },
    61: { desc: "Slight Rain", bg: "rain-background", emoji: "🌦️" },
    63: { desc: "Moderate Rain", bg: "rain-background", emoji: "🌧️" },
    65: { desc: "Heavy Rain", bg: "rain-background", emoji: "🌧️" },
    71: { desc: "Slight Snow", bg: "snow-background", emoji: "🌨️" },
    73: { desc: "Moderate Snow", bg: "snow-background", emoji: "🌨️" },
    75: { desc: "Heavy Snow", bg: "snow-background", emoji: "❄️" },
    80: { desc: "Slight Rain Showers", bg: "rain-background", emoji: "🌦️" },
    81: { desc: "Moderate Rain Showers", bg: "rain-background", emoji: "🌧️" },
    82: { desc: "Violent Rain Showers", bg: "rain-background", emoji: "🌧️" },
    85: { desc: "Slight Snow Showers", bg: "snow-background", emoji: "🌨️" },
    86: { desc: "Heavy Snow Showers", bg: "snow-background", emoji: "❄️" },
    95: { desc: "Thunderstorm", bg: "thunderstorm-background", emoji: "⛈️" },
    96: { desc: "Thunderstorm with slight hail", bg: "thunderstorm-background", emoji: "⛈️" },
    99: { desc: "Thunderstorm with heavy hail", bg: "thunderstorm-background", emoji: "⛈️" }
};

// Wind direction helper
function getWindDirection(degree) {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round((degree % 360) / 22.5) % 16;
    return directions[index];
}

// Enhanced weather data fetching with hourly and daily forecasts
async function fetchExtendedWeatherData(city) {
    try {
        // First, get coordinates for the city
        const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en`);
        const geocodeData = await geocodeResponse.json();

        if (!geocodeData.results || geocodeData.results.length === 0) {
            throw new Error(`City '${city}' not found`);
        }

        const { latitude, longitude, name } = geocodeData.results[0];

        // Build the API URL with all required parameters
        const params = new URLSearchParams({
            latitude: latitude,
            longitude: longitude,
            current_weather: 'true',
            daily: [
                'precipitation_sum',
                'apparent_temperature_max', 
                'apparent_temperature_min',
                'precipitation_probability_max',
                'weather_code',
                'precipitation_hours'
            ].join(','),
            hourly: [
                'temperature_2m',
                'relative_humidity_2m', 
                'precipitation',
                'weather_code',
                'wind_direction_80m',
                'apparent_temperature',
                'precipitation_probability'
            ].join(','),
            timezone: 'auto'
        });

        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        const forecast = await weatherResponse.json();

        return processWeatherData(forecast, name);
    } catch (error) {
        throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
}

// Process the weather data similar to your Python function
function processWeatherData(forecast, locationName) {
    const currentWeather = forecast.current_weather;
    const currentTime = new Date(currentWeather.time);
    
    // Find current hour data from hourly forecast
    let currentHourlyData = {
        humidity: null,
        precipitation: null,
        weather_code: null,
        wind_direction: null,
        apparent_temperature: null
    };

    // Search for matching hour in hourly data
    for (let index = 0; index < forecast.hourly.time.length; index++) {
        const hourTime = new Date(forecast.hourly.time[index]);
        
        if (hourTime.getMonth() === currentTime.getMonth() &&
            hourTime.getDate() === currentTime.getDate() &&
            hourTime.getHours() === currentTime.getHours() &&
            hourTime.getFullYear() === currentTime.getFullYear()) {
            
            currentHourlyData = {
                humidity: forecast.hourly.relative_humidity_2m[index],
                precipitation: forecast.hourly.precipitation[index],
                weather_code: forecast.hourly.weather_code[index],
                wind_direction: forecast.hourly.wind_direction_80m[index],
                apparent_temperature: forecast.hourly.apparent_temperature[index]
            };
            break;
        }
    }

    // Find current day data from daily forecast
    let currentDailyData = {
        max_temp: null,
        min_temp: null,
        precipitation_hours: null
    };

    for (let index = 0; index < forecast.daily.time.length; index++) {
        const dayTime = new Date(forecast.daily.time[index]);
        
        if (dayTime.getMonth() === currentTime.getMonth() &&
            dayTime.getDate() === currentTime.getDate()) {
            
            currentDailyData = {
                max_temp: forecast.daily.apparent_temperature_max[index],
                min_temp: forecast.daily.apparent_temperature_min[index],
                precipitation_hours: forecast.daily.precipitation_hours[index]
            };
            break;
        }
    }

    // Generate hourly forecast for next 24 hours
    const hourlyForecast = generateHourlyForecast(forecast, currentTime);

    // Get weather info
    const weatherInfo = weatherCodes[currentHourlyData.weather_code] || weatherCodes[0];

    return {
        location: locationName,
        current_weather: {
            temperature: currentWeather.temperature,
            apparent_temperature: Math.round(currentHourlyData.apparent_temperature || currentWeather.temperature),
            humidity: Math.round(currentHourlyData.humidity || 0),
            precipitation: Math.round((currentHourlyData.precipitation || 0) * 10) / 10,
            wind_speed: Math.round(currentWeather.windspeed),
            wind_direction: getWindDirection(currentHourlyData.wind_direction || currentWeather.winddirection),
            weather_code: currentHourlyData.weather_code || currentWeather.weathercode,
            weather: weatherInfo.desc,
            bg: weatherInfo.bg,
            emoji: weatherInfo.emoji
        },
        daily: {
            max_temp: currentDailyData.max_temp || 0,
            min_temp: currentDailyData.min_temp || 0,
            precipitation_hours: Math.round(currentDailyData.precipitation_hours || 0),
            precipitation_sum: Math.round((forecast.daily.precipitation_sum[0] || 0) * 10) / 10,
            precipitation_probability: forecast.daily.precipitation_probability || 0
        },
        hourly_forecast: hourlyForecast,
        raw_data: forecast // Keep original data for debugging
    };
}

// Generate hourly forecast for next 24 hours
function generateHourlyForecast(forecast, currentTime) {
    const hourlyForecast = [];
    const endTime = new Date(currentTime.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now

    for (let i = 0; i < forecast.hourly.time.length; i++) {
        const hourTime = new Date(forecast.hourly.time[i]);
        
        if (hourTime > currentTime && hourTime <= endTime) {
            const weatherInfo = weatherCodes[forecast.hourly.weather_code[i]] || weatherCodes[0];
            
            hourlyForecast.push({
                time: hourTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                }),
                rain: Math.round(forecast.hourly.precipitation_probability[i] || 0),
                temperature: Math.round((forecast.hourly.temperature_2m[i] || 0) * 10) / 10,
                humidity: Math.round(forecast.hourly.relative_humidity_2m[i] || 0),
                precipitation: Math.round((forecast.hourly.precipitation[i] || 0) * 10) / 10,
                weather_code: weatherInfo.desc,
                wind_direction: getWindDirection(forecast.hourly.wind_direction_80m[i]),
                apparent_temperature: Math.round((forecast.hourly.apparent_temperature[i] || 0) * 10) / 10,
                emoji: weatherInfo.emoji,
                description: weatherInfo.desc
            });
        }
    }

    return hourlyForecast;
}

// Enhanced display function for extended weather data
function displayExtendedWeather(data) {
    // Display current weather (existing functionality)
    document.getElementById('app-heading').textContent = data.location;
    document.getElementById('weather-desc').textContent = data.current_weather.weather;
    document.getElementById('temp-value').textContent = data.current_weather.temperature;
    document.getElementById('feel-temp').textContent = data.current_weather.apparent_temperature;
    document.getElementById('min-temp').textContent = data.daily.min_temp;
    document.getElementById('max-temp').textContent = data.daily.max_temp;
    document.getElementById('humidity').textContent = data.current_weather.humidity;
    document.getElementById('wind-speed').textContent = data.current_weather.wind_speed;
    //document.getElementById('rain-risk').textContent = data.current

    // Display additional data if elements exist
    if (document.getElementById('precipitation')) {
        document.getElementById('precipitation').textContent = data.current_weather.precipitation;
    }
    if (document.getElementById('precipitation-hours')) {
        document.getElementById('precipitation-hours').textContent = data.daily.precipitation_hours;
    }
    if (document.getElementById('rain-risk')) {
        document.getElementById('rain-risk').textContent = data.daily.precipitation_probability;
    }

    // Display hourly forecast if container exists
    displayHourlyForecast(data.hourly_forecast);

    document.getElementById('weather-display').classList.add('show');
    activateScene(data.current_weather.bg);
}

// Display hourly forecast
function displayHourlyForecast(hourlyData) {
    const container = document.getElementById('hourly-forecast');
    if (!container) return;

    container.innerHTML = '';
    
    hourlyData.forEach(hour => {
        const hourElement = document.createElement('div');
        hourElement.className = 'hourly-item';
        hourElement.innerHTML = `
            <div class="hour-time">${hour.time}</div>
            <div class="hour-emoji">${hour.emoji}</div>
            <div class="hour-temp">${hour.temperature}°</div>
            <div class="hour-rain">${hour.rain}%</div>
        `;
        container.appendChild(hourElement);
    });
}

// Updated form submission handler
document.getElementById('weather-app').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    
    // if (!city) {
    //     showError('Please enter a city name');
    //     return;
    // }

    const searchButton = document.getElementById('search-button');
    const originalText = searchButton.innerHTML;
    searchButton.innerHTML = '<div class="loading"></div>';
    searchButton.disabled = true;

    try {
        // Use the enhanced weather data function
        const weatherData = await fetchExtendedWeatherData(city);
        displayExtendedWeather(weatherData);
        
        // Clear any previous errors
        document.getElementById('error-container').innerHTML = '';
        
        // Log detailed data for debugging
        console.log('Extended weather data:', weatherData);
        
    } catch (error) {
        // showError(error.message);
        console.error('Weather fetch error:', error);
    } finally {
        searchButton.innerHTML = originalText;
        searchButton.disabled = false;
    }
});