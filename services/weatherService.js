async function isCityAvailable(cityName) {
  // Виконати запит до вашого API або джерела даних для перевірки доступності міста
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=2f6eda8a8af558ce4ff7adf8d766b986`
  );
  const data = await response.json();

  // Перевірити, чи місто знайдено
  if (data.cod === "404") {
    return false; // Місто не знайдено
  } else {
    return true; // Місто знайдено
  }
}

module.exports = {
  isCityAvailable,
};
