const middy = require('middy');
const { initDB } = require('../middleware/initDb');
const { errorHandler } = require('../middleware/errorHandler');
const WeatherService = require('../services/weather.service');
const {
  toggleWeatherProviderPin,
} = require('../repository/weatherPin.repository');
const { success, failure } = require('../utils/responses');
require('dotenv').config();

const fetchWeatherHandler = middy(async (event) => {
  try {
    const weatherData = await WeatherService.fetchWeatherData(
      event?.queryStringParameters
    );
    return success({
      message: 'Weather data fetched successfully.',
      data: weatherData,
    });
  } catch (err) {
    console.error('Error fetching weather data:', err);
    return failure(500, 'Failed to fetch weather data.');
  }
})
  .use(initDB)
  .use(errorHandler);

const togglePinHandler = middy(async (event) => {
  try {
    const { provider, city, temperature, condition, isPinned } = JSON.parse(
      event.body
    );
    const result = await toggleWeatherProviderPin(
      provider,
      city,
      temperature,
      condition,
      isPinned
    );
    return success({
      message: `Provider ${result?.isPinned ? 'pinned' : 'unpinned'} successfully.`,
      data: result,
    });
  } catch (err) {
    console.error('Error toggling pin:', err);
    return failure(500, 'Failed to toggle pin for provider.');
  }
})
  .use(initDB)
  .use(errorHandler);

module.exports = {
  fetchWeatherHandler,
  togglePinHandler,
};
