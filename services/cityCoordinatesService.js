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

module.exports = {
  getCityCoordinates,
  getWeatherForecast,
};
