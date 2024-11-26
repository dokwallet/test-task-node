const { fetchWeatherData } = require('../services/weather.service');
const { toggleProviderPin } = require('../repository/weatherPin.repository');
const { success, failure } = require('../utils/responses');

// Handle GET /api/weather
const getWeatherData = async (event) => {
  try {
    const weatherData = await fetchWeatherData();
    return success({
      message: 'Weather data fetched successfully.',
      data: weatherData,
    });
  } catch (err) {
    console.error('Error in fetching weather data:', err.message);
    return failure(500, 'Failed to fetch weather data.');
  }
};

// Handle POST /api/weather/togglePin
const toggleWeatherPin = async (event) => {
  try {
    const { providerName } = JSON.parse(event.body);

    if (!providerName) {
      return failure(400, 'Provider name is required.');
    }

    const result = await toggleProviderPin(providerName);
    return success({
      message: 'Provider pin toggled successfully.',
      data: result,
    });
  } catch (err) {
    console.error('Error in toggling provider pin:', err.message);
    return failure(500, 'Failed to toggle provider pin.');
  }
};

module.exports = {
  getWeatherData,
  toggleWeatherPin,
};
