// Function to toggle dark mode
const themeToggleButton = document.getElementById('theme-toggle');
themeToggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  localStorage.setItem('theme', currentTheme);
});

// Load saved theme from localStorage
window.onload = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme && savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
};

// Function to fetch weather data from OpenWeatherMap API
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  
  if (!city) {
    alert("Please enter a valid city name.");
    return;
  }

  const apiKey = 'e36d21750c23b23a5cc71923dc1f95c4'; // Your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const loader = document.getElementById('loader');
  const weatherResult = document.getElementById('weatherResult');
  const chartSection = document.getElementById('chartSection');

  loader.style.display = 'block';
  weatherResult.innerHTML = ''; // Clear previous weather data
  chartSection.style.display = 'none'; // Hide previous chart

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Log the entire response for debugging
    console.log('API Response:', data);

    if (data.cod === 200) {
      const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // Weather icon
      const date = new Date();
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      
      weatherResult.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${weatherIcon}" alt="${data.weather[0].main}" />
        <p>${data.weather[0].main}</p>
        <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        <p><strong>Weather updated on:</strong> ${formattedDate}</p>
      `;

      showWeatherChart(data.main.temp, data.main.humidity, data.wind.speed);
    } else {
      weatherResult.innerHTML = `<h3>City not found. Please try again!</h3>`;
    }
  } catch (error) {
    loader.style.display = 'none';
    console.error("Error fetching weather data:", error);
    weatherResult.innerHTML = `<h3>Error fetching weather data. Please try again later.</h3>`;
  }
}

// Function to display the weather data chart
function showWeatherChart(temp, humidity, windSpeed) {
  const ctx = document.getElementById('weatherChart').getContext('2d');

  // Clear the previous chart if it exists
  if (window.weatherChartInstance) {
    window.weatherChartInstance.destroy();
  }

  window.weatherChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Temperature (°C)', 'Humidity (%)', 'Wind Speed (m/s)'],
      datasets: [{
        label: 'Weather Data',
        data: [temp, humidity, windSpeed],
        backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  document.getElementById('chartSection').style.display = 'block'; // Show the chart
}
