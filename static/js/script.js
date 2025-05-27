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