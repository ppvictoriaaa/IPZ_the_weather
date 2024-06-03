async function isCityAvailable(cityName) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2f6eda8a8af558ce4ff7adf8d766b986`
  );
  const data = await response.json();

  // Перевірка чи знайдено місто
  if (data.cod === "404") {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isCityAvailable,
};
