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

function updateWeatherDisplay(dataG) {
    
    // Mostrar la ubicación
    console.log(dataG);
    updateUbicationDisplay(dataG.location.name, dataG.location.country);  
    updateTemperatureDisplay(dataG.current.temp_c, dataG.current.feelslike_c);
    updateConditionsDisplay(dataG.current.condition.text, dataG.current.condition.icon);
    updateDayDisplay(dataG.current.last_updated);
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
init();
