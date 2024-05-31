const cron = require("node-cron");
const db = require("../routes/db-config");
const util = require("util");
const { sendNewsletterEmail } = require("./emailService");
const { getCityCoordinates } = require("./cityCoordinatesService");
const { getWeatherForecast } = require("./cityCoordinatesService");

const query = util.promisify(db.query).bind(db);

const API_KEY = "2f6eda8a8af558ce4ff7adf8d766b986";

const getUsernameById = async (userId) => {
  try {
    const userResults = await query(
      "SELECT username FROM account WHERE account_id = ?",
      [userId]
    );
    if (userResults.length > 0) {
      return userResults[0].username;
    } else {
      console.error(`No user found with ID: ${userId}`);
      return "User";
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

const sendRegularNewsletter = async () => {
  try {
    const users = await query("SELECT * FROM newsletters");

    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) - 6 (Saturday)

    for (const user of users) {
      const { user_id, email, region, frequency } = user;
      const username = await getUsernameById(user_id);
      let message = `Hello ${username},\n\n`;

      if (
        frequency === "daily" ||
        (frequency === "weekly" && dayOfWeek === 6)
      ) {
        try {
          const { lat, lon } = await getCityCoordinates(region, API_KEY);
          const weatherData = await getWeatherForecast(lat, lon, API_KEY);
          const weatherList = weatherData.list
            .slice(0, 5)
            .map((item) => {
              return `${item.dt_txt}: ${item.weather[0].description}, Temp: ${item.main.temp}°C`;
            })
            .join("\n");

          message += `Here is your weather update for the ${region} region:\n\n${weatherList}\n`;
        } catch (error) {
          message += `Unable to fetch weather data for ${region} at this time.\n`;
        }
      }

      sendNewsletterEmail(email, message);
    }
  } catch (error) {
    console.error("Error sending regular newsletters:", error);
  }
};

module.exports = {
  sendRegularNewsletter,
};
