async function getWeather() {
    const city = document.getElementById('cityInput').value;  // Get city entered by user
    const apiKey = 'e36d21750c23b23a5cc71923dc1f95c4';  // 🔥 Replace with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.cod == 200) {
        document.getElementById('weatherResult').innerHTML = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <h3>${data.weather[0].main}</h3>
          <p>Temperature: ${data.main.temp} °C</p>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
      } else {
        document.getElementById('weatherResult').innerHTML = `<h3>City not found!</h3>`;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('weatherResult').innerHTML = `<h3>Error fetching weather data!</h3>`;
    }
  }
  