let apiKey = '2d2c8069e71a46cc9da123536242110';
let ubication = '';
let initialized = false;

async function init() {
    if (initialized) return;
    initialized = true;

    console.log("Iniciando...");
    // Intentar obtener la ubicación
    if (navigator.geolocation) {
        console.log("Intentando obtener la ubicación...");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        console.log("Geolocalización no es soportada por este navegador.");
        await fetchWeather('Bogotá');
    }
}

async function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    try {
        await getCityName(latitude, longitude);
        await fetchWeather(ubication);
        localStorage.setItem('ubication', ubication); // Almacenar la ubicación
    } catch (error) {
        console.error(error);
        await fetchWeather('Bogotá'); // Fallback en caso de error
    }
}

function showError(error) {
    console.error("Error al obtener la ubicación:", error);
    fetchWeather('Bogotá'); // Usar Bogotá como ciudad por defecto
}

async function getCityName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener la ciudad.");
        }
        const data = await response.json();
        ubication = data.address.city || data.address.town || data.address.village || "Ciudad no encontrada";         
    } catch (error) {
        console.error("Error en getCityName:", error);
        ubication = "Ciudad no encontrada"; // Asignar valor por defecto en caso de error
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=12`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del clima.');
        }
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error en fetchWeather:', error);
    }
}
async function fetchWeather1(city) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10`);
        if (!response.ok) {
            throw new Error('Error al obtener datos del clima.');
        }
        const data = await response.json();
        return data; // Ahora devuelve los datos completos para usarlos en otras funciones
    } catch (error) {
        console.error('Error en fetchWeather:', error);
    }
}

function updateWeatherDisplay(dataG) {
    // Actualizar la información básica de la ubicación y clima actual
    updateUbicationDisplay(dataG.location.name, dataG.location.country);  
    updateTemperatureDisplay(dataG.current.temp_c, dataG.current.feelslike_c);
    updateConditionsDisplay(dataG.current.condition.text, dataG.current.condition.icon);
    updateDayDisplay(dataG.current.last_updated);

    // Extraer el pronóstico diario para calcular promedios de día y noche
    const forecastDay = dataG.forecast.forecastday[0];
    
    // Llamar a la función para calcular los promedios de temperatura para el día y la noche
    calculateDayAndNightAverages(forecastDay);

    // Actualizar detalles adicionales del clima
    updateWeatherDetails(forecastDay.day);
    
    // Actualizar las próximas 6 horas con el pronóstico
    updateNextHoursForecast(forecastDay.hour);

    // Actualizar probabilidad de lluvia cada 6 horas
    updateRainChanceEvery6Hours(forecastDay);
}

function calculateDayAndNightAverages(forecastDay) {
    const tempDay = [];
    const tempNight = [];

    // Recorrer las horas del pronóstico
    forecastDay.hour.forEach(hourData => {
        const hour = new Date(hourData.time).getHours();

        if (hour >= 6 && hour < 18) {
            // 6am a 6pm es "día"
            tempDay.push(hourData.temp_c);
        } else {
            // 6pm a 6am es "noche"
            tempNight.push(hourData.temp_c);
        }
    });

    // Llamar a la función updateNight para calcular y mostrar los promedios
    updateNight(tempDay, tempNight);
}

function updateNight(tempDay, tempNight) {
    // Calcular promedio de temperaturas de día
    const avgTempDay = tempDay.reduce((sum, temp) => sum + temp, 0) / tempDay.length;
    
    // Calcular promedio de temperaturas de noche
    const avgTempNight = tempNight.reduce((sum, temp) => sum + temp, 0) / tempNight.length;
    const temNight = document.getElementById('tempNigth');
    temNight.innerHTML = `Nigth ${avgTempNight.toFixed()}°`;
    const temDay = document.getElementById('tempDay');
    temDay.innerHTML = `Day ${avgTempDay.toFixed()}°`;
}

function updateWeatherDetails(dayData) {
    // Actualizar velocidad del viento
    const windSpeedElement = document.getElementById('windSpeed');
    windSpeedElement.innerHTML = `Wind speed <br> ${dayData.maxwind_kph} km/h`;

    // Actualizar probabilidad de lluvia
    const rainChanceElement = document.getElementById('rainChance');
    rainChanceElement.innerHTML = `Rain chance <br> ${dayData.daily_chance_of_rain}%`;

    // Actualizar presión
    const pressureElement = document.getElementById('pressure');
    pressureElement.innerHTML = `Pressure <br> ${dayData.avgtemp_f} hpa`;

    // Actualizar índice UV
    const uvIndexElement = document.getElementById('uvIndex');
    uvIndexElement.innerHTML = `Uv index <br> ${dayData.uv}`;
}

function updateUbicationDisplay(city, country) {
    const name = document.getElementById('nameCity');
    name.innerHTML = `${city}, ${country}`;
}

function updateTemperatureDisplay(temperature, feels) {
    const temp = document.getElementById('temperature');
    temp.innerHTML = `${temperature}°`;
    const feelsLike = document.getElementById('feelTemp');
    feelsLike.innerHTML = `Feels like ${feels}°`;
}

function updateConditionsDisplay(conditions, icon) {
    const conditionsElement = document.getElementById('conditions');
    const iconElement = document.getElementById('iconImg');
    
    conditionsElement.innerHTML = conditions;
    iconElement.src = icon;
}

function updateDayDisplay(dateString){
    // Crear un objeto Date a partir de la cadena de fecha
    const date = new Date(dateString);
        
    if (isNaN(date.getTime())) {
        throw new Error("Fecha inválida. Asegúrate de usar el formato YYYY-MM-DD HH:mm");
    }

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const day = date.getDate(); // Obtener el día del mes
    const month = months[date.getMonth()]; // Obtener el mes
    const hours = String(date.getHours()).padStart(2, '0'); // Obtener la hora y formatear a 2 dígitos
    const minutes = String(date.getMinutes()).padStart(2, '0'); // Obtener los minutos y formatear a 2 dígitos

    const dayElement = document.getElementById('day');
    dayElement.innerHTML = `${month}, ${day} ${hours}:${minutes}`;
}

function updateNextHoursForecast(hourlyData) {
    // Seleccionamos las horas cada 2 horas
    const nextSixHours = hourlyData.filter((hourData, index) => index % 2 === 0).slice(0, 6);

    // Recorrer las próximas 6 horas y actualizar el HTML
    const hoursContainer = document.querySelector('.hours');
    hoursContainer.innerHTML = ''; // Limpiar contenido anterior

    nextSixHours.forEach(hourData => {
        // Crear un div para cada hora
        const hourDiv = document.createElement('div');
        hourDiv.classList.add('hour-item');

        // Extraer la hora en formato legible
        const hour = new Date(hourData.time).getHours();
        const formattedHour = `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;

        // Crear contenido del div
        hourDiv.innerHTML = `
            <p>${formattedHour}</p>
            <img src="${hourData.condition.icon}" alt="${hourData.condition.text}">
            <p>${hourData.temp_c}°C</p>
        `;

        // Añadir el div al contenedor
        hoursContainer.appendChild(hourDiv);
    });
}

function updateRainChanceEvery6Hours(forecastDay) {
    // Limpiar el contenedor de barras de lluvia para actualizar con nuevos datos
    const rainSection = document.querySelector('.rain-chance');
    rainSection.innerHTML = `
        <div class="section-title">
            <div class="forecast-icon">
                <img class="large-img" src="storage/img/rainy.png" alt="">
            </div> Chance of Rain
        </div>
    `;

    // Iterar sobre las horas del día con un intervalo de 6 horas (0, 6, 12, 18 horas)
    for (let i = 0; i < forecastDay.hour.length; i += 6) {
        const hourData = forecastDay.hour[i];
        const time = new Date(hourData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const rainChance = hourData.chance_of_rain;

        // Crear barra de probabilidad de lluvia
        const rainBarHTML = `
            <div class="rain-bar">
                <div class="time">${time}</div>
                <div class="bar-container">
                    <div class="bar" style="width: ${rainChance}%;"></div>
                </div>
                <div class="percentage">${rainChance}%</div>
            </div>
        `;
        
        // Insertar cada barra de probabilidad de lluvia en el contenedor
        rainSection.innerHTML += rainBarHTML;
    }
}

// Función que se activa cuando se hace clic en el botón 'bNextDays'
function showNextDaysForecast(forecastDays) {
    // Limpiar el contenido actual del main
    const mainContainer = document.querySelector('.container');
    mainContainer.innerHTML = ''; // Borra todo el contenido actual del main
    
    // Recorrer los días del pronóstico y crear las cards
    forecastDays.forEach(dayData => {
        const date = new Date(dayData.date).toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
        const tempMin = dayData.day.mintemp_c;
        const tempMax = dayData.day.maxtemp_c;
        const iconUrl = dayData.day.condition.icon;
        
        // Crear el HTML de la card para cada día
        const cardHTML = `
            <div class="day-card">
                <p class="day-date">${date}</p>
                <img class="weather-icon" src="${iconUrl}" alt="Weather icon">
                <p class="temp-max">Max: ${tempMax}°C</p>
                <p class="temp-min">Min: ${tempMin}°C</p>
            </div>
        `;
        
        // Insertar cada card dentro del contenedor principal
        mainContainer.innerHTML += cardHTML;
    });
}

// Asignar el evento click al botón 'bNextDays'
document.getElementById('bNextDays').addEventListener('click', () => {
    // Se obtiene el pronóstico de los próximos días y se pasa a la función
    fetchWeather(ubication).then(data => {
        const forecastDays = data.forecast.forecastday; // Array con los días del pronóstico
        showNextDaysForecast(forecastDays); // Llamar a la función para mostrar los días
    });
});



init();
