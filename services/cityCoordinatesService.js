const axios = require("axios");

const getCityCoordinates = async (cityName, apiKey) => {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
  try {
    const response = await axios.get(geoUrl);
    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat, lon };
    } else {
      throw new Error(`No coordinates found for city: ${cityName}`);
    }
  } catch (error) {
    console.error(`Failed to fetch coordinates for city: ${cityName}`, error);
    throw error;
  }
};

const getWeatherForecast = async (lat, lon, apiKey) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  try {
    const response = await axios.get(weatherUrl);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch weather data", error);
    throw error;
  }
};

const groupForecastByDay = (forecastList) => {
  const dailyForecasts = {};
  forecastList.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(item);
  });
  return dailyForecasts;
};

const generateWeatherSummary = (dailyForecasts) => {
  const dates = Object.keys(dailyForecasts).sort();
  let summary = "";
  for (let i = 0; i < 3; i++) {
    const date = dates[i];
    if (date) {
      const dayForecast = dailyForecasts[date];
      const temperatures = dayForecast.map((item) => item.main.temp);
      const minTemp = Math.min(...temperatures);
      const maxTemp = Math.max(...temperatures);
      const description = dayForecast[0].weather[0].description;
      summary += `${date}: ${description}, Min Temp: ${minTemp}°C, Max Temp: ${maxTemp}°C\n`;
    }
  }
  return summary;
};

module.exports = {
  getCityCoordinates,
  getWeatherForecast,
  groupForecastByDay,
  generateWeatherSummary,
};
