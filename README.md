# Weather Forecast Dashboard

Este proyecto es una página web que muestra información sobre el clima usando la API de [WeatherAPI](https://www.weatherapi.com/). El usuario puede consultar las condiciones actuales, la probabilidad de lluvia cada 6 horas, y el pronóstico extendido para los próximos días. **Sin embargo, el proyecto no puede ser completado en su totalidad debido a errores relacionados con CORS y bloqueos de la API (502 Bad Gateway).**

## Funcionalidades principales

### 1. **Obtención del clima actual**
   La página permite obtener la información del clima actual de una ubicación, ya sea detectando la ubicación del usuario automáticamente mediante el GPS o ingresando manualmente el nombre de una ciudad.
   
   - **Función:** `fetchWeather()`
     - Esta función utiliza `fetch()` para hacer una solicitud a la API de WeatherAPI.
     - Recibe como parámetro el nombre de la ciudad y realiza la llamada a la API para obtener el clima actual y el pronóstico para los siguientes días.
     - Si la solicitud es exitosa, los datos del clima se muestran en la interfaz de la página.
     - En caso de error, captura la excepción y muestra un mensaje de error en la consola.

### 2. **Actualización de la probabilidad de lluvia**
   Cada 6 horas, se actualiza la probabilidad de lluvia en la sección designada en la página.
   
   - **Función:** `updateRainChance()`
     - Esta función recibe los datos de la API sobre la probabilidad de lluvia y actualiza dinámicamente el contenido en la página.
     - Se muestra la probabilidad de lluvia en intervalos de 6 horas a partir de la hora actual.

### 3. **Pronóstico extendido**
   Al hacer clic en el botón "Siguientes días", se limpia el contenido actual y se genera una lista de tarjetas que muestran el pronóstico de los próximos días, incluyendo:
   - Fecha
   - Temperatura mínima y máxima
   - Icono del clima (soleado, nublado, lluvia, etc.)

   - **Función:** `createForecastCards()`
     - Esta función elimina el contenido existente en la sección principal (`<main>`) y genera tarjetas para los días siguientes.
     - Cada tarjeta incluye la fecha, temperatura mínima y máxima, y un ícono representando las condiciones del clima.

### 4. **Detección automática de ubicación**
   La página puede detectar la ubicación del usuario utilizando la API de Geolocalización del navegador. Si el usuario lo permite, la página utilizará las coordenadas para buscar el clima en la ciudad correspondiente.

   - **Función:** `showPosition()`
     - Utiliza `navigator.geolocation.getCurrentPosition()` para obtener la latitud y longitud del usuario.
     - Luego, pasa estas coordenadas a la función `fetchWeather()` para mostrar el clima de la ubicación detectada.

## Problemas conocidos

### 1. **Error CORS**
   Durante el desarrollo de este proyecto, nos encontramos con problemas de **CORS (Cross-Origin Resource Sharing)**. El API de WeatherAPI bloquea las peticiones directas desde el frontend debido a las políticas de CORS, lo que impide acceder a los datos directamente desde el navegador. A pesar de utilizar un proxy para evitar este bloqueo, los errores persisten en algunas situaciones.

   - **Solución propuesta:** Realizar las solicitudes desde un backend propio para evitar las restricciones de CORS.

### 2. **Error 502 Bad Gateway**
   En algunos momentos, la API devuelve un error **502 (Bad Gateway)**. Esto ocurre probablemente debido a problemas temporales con el servidor de la API, lo que afecta la estabilidad de las solicitudes.

## Requisitos

- Navegador con soporte para `fetch()` y la API de Geolocalización.
- Conexión a Internet para acceder a los datos del clima.
- Si se implementa un servidor proxy para evitar problemas de CORS, será necesario tener un servidor backend configurado.

## Cómo ejecutar el proyecto

1. Clona el repositorio en tu máquina local:
   ```bash
   git clone https://github.com/RobinsonMosqueraCubides/WeatherApp
   ```

2. Abre el archivo `index.html` en tu navegador (puedes utilizar una extensión como "Live Server" para ejecutar un servidor local).

3. Permite el acceso a la ubicación si quieres que la página detecte automáticamente el clima en tu ciudad.

## Problemas a resolver

Debido a las restricciones de la API de WeatherAPI y los errores de CORS, actualmente no es posible obtener los datos de manera fiable. Las soluciones a considerar son:

- Implementar una capa backend que realice las peticiones a la API y retorne los datos al frontend.
- Utilizar una API de clima alternativa que no tenga restricciones de CORS.
  
## Autor

Robinson Mosquera
