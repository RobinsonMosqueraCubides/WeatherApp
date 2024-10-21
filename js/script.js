let apiKey = '2d2c8069e71a46cc9da123536242110';
let ubication = '';
let initialized = false;
console.log("hola");

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
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10`);
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
    console.log("hola");
    
    // Mostrar la ubicación
    console.log(`Ubicación: ${dataG.location.name}, ${dataG.location.country}`);

    // Recorrer los datos del pronóstico para los próximos 10 días
    dataG.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = date.toLocaleDateString('es-ES', options);

        console.log(`\nPronóstico para el ${dateString}:`);
        console.log(`Temp máxima: ${day.day.maxtemp_c}°C`);
        console.log(`Temp mínima: ${day.day.mintemp_c}°C`);
        console.log(`Condiciones: ${day.day.condition.text}`);
        console.log(`Icono: ${day.day.condition.icon}`);
    });
}
init();
// Usar DOMContentLoaded para asegurarse de que todo esté cargado
document.addEventListener('DOMContentLoaded', (event) => {
    const storedUbication = localStorage.getItem('ubication');
    if (storedUbication) {
        fetchWeather(storedUbication);
    } else {
        console.log("hola");
        
        init();
    }
});
