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
    56: { desc: "Light Freezing Drizzle", bg: "freezing-background", emoji: "❄️" },
    57: { desc: "Dense Freezing Drizzle", bg: "freezing-background", emoji: "❄️" },
    61: { desc: "Slight Rain", bg: "rain-background", emoji: "🌦️" },
    63: { desc: "Moderate Rain", bg: "rain-background", emoji: "🌧️" },
    65: { desc: "Heavy Rain", bg: "rain-background", emoji: "🌧️" },
    66: { desc: "Light Freezing Rain", bg: "freezing-background", emoji: "❄️" },
    67: { desc: "Heavy Freezing Rain", bg: "freezing-background", emoji: "❄️" },
    71: { desc: "Slight Snow", bg: "snow-background", emoji: "🌨️" },
    73: { desc: "Moderate Snow", bg: "snow-background", emoji: "🌨️" },
    75: { desc: "Heavy Snow", bg: "snow-background", emoji: "❄️" },
    77: { desc: "Snow Grains", bg: "snow-background", emoji: "❄️" },
    80: { desc: "Slight Rain Showers", bg: "rain-background", emoji: "🌦️" },
    81: { desc: "Moderate Rain Showers", bg: "rain-background", emoji: "🌧️" },
    82: { desc: "Violent Rain Showers", bg: "rain-background", emoji: "🌧️" },
    85: { desc: "Slight Snow Showers", bg: "snow-background", emoji: "🌨️" },
    86: { desc: "Heavy Snow Showers", bg: "snow-background", emoji: "❄️" },
    95: { desc: "Thunderstorm", bg: "thunderstorm-background", emoji: "⛈️" },
    96: { desc: "Thunderstorm with slight hail", bg: "thunderstorm-background", emoji: "⛈️" },
    99: { desc: "Thunderstorm with heavy hail", bg: "thunderstorm-background", emoji: "⛈️" }
};

// Wind direction function
function getWindDirection(degree) {
    const directions = [
        "N", "NNE", "NE", "ENE",
        "E", "ESE", "SE", "SSE", 
        "S", "SSW", "SW", "WSW",
        "W", "WNW", "NW", "NNW"
    ];
    const index = Math.round((degree % 360) / 22.5) % 16;
    return directions[index];
}

// Geocoding function
async function geocodeCity(cityName) {
    const url = `http://localhost:3000/api/geocode?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    
    console.log("URL geocoding: ", url);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    if (!data.results || data.results.length === 0) {
        throw new Error('City not found');
    }

    return data.results[0];
}

// Weather forecast function
async function getWeatherForecast(lat, lon) {
    const dailyParams = [
        'precipitation_sum', 'apparent_temperature_max', 'apparent_temperature_min',
        'weathercode', 'precipitation_hours'
    ].join(',');
    const hourlyParams = [
        'temperature_2m', 'relative_humidity_2m', 'precipitation', 'weathercode',
        'wind_direction_80m', 'apparent_temperature'
    ].join(',');
    const url = `http://localhost:3000/api/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=${dailyParams}&hourly=${hourlyParams}&timezone=auto`;    //const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=${dailyParams}&hourly=${hourlyParams}&timezone=auto`;
    console.log("[getWeatherForecast] Attempting to fetch URL:", url);
    try {
        const response = await fetch(url);
        console.log("[getWeatherForecast] Response status:", response.status);
        if (!response.ok) {
            throw new Error(`Weather API HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("[getWeatherForecast] Received data:", data);
        return data;
    } catch (error) {
        console.error("[getWeatherForecast] Fetch error:", error.message || error);
        throw error;
    }
}

// Main forecast function
async function forecast(cityName) {
    try {
        console.log("tried forecast")
        const cityData = await geocodeCity(cityName);
        console.log("City data:", cityData);
        const weatherData = await getWeatherForecast(cityData.latitude, cityData.longitude);
        console.log("Weather data: ", weatherData);
        const currentTime = new Date(weatherData.current_weather.time);
        
        // Find current hour data
        let currentHourIndex = -1;
        for (let i = 0; i < weatherData.hourly.time.length; i++) {
            const hourTime = new Date(weatherData.hourly.time[i]);
            if (hourTime.getTime() === currentTime.getTime()) {
                currentHourIndex = i;
                break;
            }
        }
        
        // Find current day data
        let currentDayIndex = -1;
        for (let i = 0; i < weatherData.daily.time.length; i++) {
            const dayTime = new Date(weatherData.daily.time[i]);
            if (dayTime.toDateString() === currentTime.toDateString()) {
                currentDayIndex = i;
                break;
            }
        }
        
        const currentWeatherCode = currentHourIndex >= 0 ? weatherData.hourly.weathercode[currentHourIndex] : weatherData.current_weather.weathercode;
        const weatherInfo = weatherCodes[currentWeatherCode] || { desc: "Unknown", bg: "default-background", emoji: "❓" };
        
        // Build daily forecast
        const dailyForecast = [];
        for (let i = 0; i < weatherData.daily.time.length; i++) {
            const dayTime = new Date(weatherData.daily.time[i]);
            if (dayTime.toDateString() !== currentTime.toDateString()) {
                const dayWeatherInfo = weatherCodes[weatherData.daily.weathercode[i]] || { desc: "Unknown", emoji: "❓" };
                dailyForecast.push({
                    weekday: dayTime.toLocaleDateString('en', { weekday: 'short' }),
                    precipitation_sum: weatherData.daily.precipitation_sum[i],
                    apparent_temperature_max: Math.round(weatherData.daily.apparent_temperature_max[i]),
                    apparent_temperature_min: Math.round(weatherData.daily.apparent_temperature_min[i]),
                    weather_code: dayWeatherInfo.desc,
                    precipitation_hours: weatherData.daily.precipitation_hours[i],
                    emoji: dayWeatherInfo.emoji
                });
            }
        }
        
        return {
            location: cityData.name,
            temperature: Math.round(weatherData.current_weather.temperature),
            max_temp: currentDayIndex >= 0 ? Math.round(weatherData.daily.apparent_temperature_max[currentDayIndex]) : Math.round(weatherData.current_weather.temperature),
            min_temp: currentDayIndex >= 0 ? Math.round(weatherData.daily.apparent_temperature_min[currentDayIndex]) : Math.round(weatherData.current_weather.temperature),
            wind_speed: Math.round(weatherData.current_weather.windspeed),
            wind_direction: getWindDirection(weatherData.current_weather.winddirection),
            humidity: currentHourIndex >= 0 ? Math.round(weatherData.hourly.relative_humidity_2m[currentHourIndex]) : 0,
            precipitation: currentHourIndex >= 0 ? weatherData.hourly.precipitation[currentHourIndex] : 0,
            weather: weatherInfo.desc,
            precipitation_hours: currentDayIndex >= 0 ? weatherData.daily.precipitation_hours[currentDayIndex] : 0,
            bg: weatherInfo.bg,
            daily_forecast: dailyForecast,
            current_apparent_temperature: currentHourIndex >= 0 ? Math.round(weatherData.hourly.apparent_temperature[currentHourIndex]) : Math.round(weatherData.current_weather.temperature)
        }
    } catch (error) {
        console.error('[forecast] Weather forecast error:', error);
        alert("Forecast error: " + (error.message || JSON.stringify(error)));
        throw error;
    }

}

// UI Functions
function toggleDropdown() {
    const dropdown = document.getElementById('dropdown-menu');
    dropdown.classList.toggle('show');
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weather-display').classList.remove('show');
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Display the weather data
function displayWeatherData(data) {
    // Update location and main temperature
    document.getElementById('location').textContent = data.location;
    document.getElementById('temp-value').textContent = data.temperature;
    document.getElementById('feel-temp').textContent = data.current_apparent_temperature;
    document.getElementById('min-temp').textContent = data.min_temp;
    document.getElementById('max-temp').textContent = data.max_temp;
    document.getElementById('weather-desc').textContent = data.weather;
    
    // Update details
    document.getElementById('humidity').textContent = data.humidity;
    document.getElementById('rain-hours').textContent = data.precipitation_hours;
    document.getElementById('wind-speed').textContent = data.wind_speed;
    
    // Update daily forecast
    const forecastContainer = document.getElementById('daily-forecast');
    forecastContainer.innerHTML = '';
    
    if (data.daily_forecast && data.daily_forecast.length > 0) {
        data.daily_forecast.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'forecast-day';
            dayElement.innerHTML = `
                <p class="day">${day.weekday}</p>
                <div class="weather-icon">
                    <span class="icon">${day.emoji}</span>
                </div>
                <p class="temp">${day.apparent_temperature_max}°C</p>
                <p class="weather-desc">${day.weather_code}</p>
            `;
            forecastContainer.appendChild(dayElement);
        });
    } else {
        forecastContainer.innerHTML = '<p>No forecast data available</p>';
    }
    
    // Set background
    setBackground(data.bg);
    
    // Show weather display
    document.getElementById('weather-display').classList.add('show');
}

async function searchWeather() {
    const cityInput = document.getElementById('city-input');
    const cityName = cityInput.value.trim();
    
    if (!cityName) {
        alert('Please enter a city name');
        return;
    }
    
    showLoading();
    
    try {
        const weatherData = await forecast(cityName);
        
        // Ensure max_temp is not less than current temp
        if (weatherData.max_temp < weatherData.temperature) {
            weatherData.max_temp = weatherData.temperature;
        }
        
        displayWeatherData(weatherData);
    // } catch (error) {
    //     console.error('Error fetching weather:', error);
    //     alert(`Error fetching weather data: ${error.message}`);
    } finally {
        hideLoading();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cityParam = urlParams.get('city_input');
    if (cityParam) {
        document.getElementById('city-input').value = cityParam;
        searchWeather();
    }
    
    // Make functions globally available
    window.handleKeyPress = handleKeyPress;
});