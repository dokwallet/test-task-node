const axios = require('axios');
const {
  fetchPinnedProviders,
} = require('../repository/weatherPin.repository.js');
const { apiEndpoint } = require('../common/apiEndpoint');
const { APIError } = require('../utils/error.js');
require('dotenv').config();

const WEATHER_APIS = [
  {
    name: 'OpenWeatherMap',
    url: `${apiEndpoint.OpenWeatherMap}${process.env.OpenWeatherMap}`,
    transformData: (data) => ({
      provider: 'OpenWeatherMap',
      city: data.name || 'Unknown',
      temperature: Number(data.main?.temp) - 273.15 || null,
      condition: data.weather[0]?.main || 'Unavailable',
      error: false,
    }),
  },
  {
    name: 'WeatherAPI',
    url: `${apiEndpoint.WeatherAPI}${process.env.WeatherApi}`,
    transformData: (data) => ({
      provider: 'WeatherAPI',
      city: data.location?.name || 'Unknown',
      temperature: data.current?.temp_c || null,
      condition: data.current?.condition?.text || 'Unavailable',
      error: false,
    }),
  },
  {
    name: 'WeatherStack',
    url: (lat, lon) =>
      `${apiEndpoint.WeatherStack}${process.env.WeatherStack}&query=${lat},${lon}`,
    transformData: (data) => {
      if (data.success === false) {
        return {
          provider: 'WeatherStack',
          city: 'Unknown',
          temperature: null,
          condition: 'Unavailable',
          error: true,
          errorMessage: data.error?.info || 'An error occurred.',
        };
      }
      return {
        provider: 'WeatherStack',
        city: data.location?.name || 'Unknown',
        temperature: data.current?.temperature || null,
        condition: data.current?.weather_descriptions?.[0] || 'Unavailable',
        error: false,
      };
    },
  },
];

async function fetchWeatherData({ lat, lon }) {
  const pinnedProviders = await fetchPinnedProviders();

  const fetchData = WEATHER_APIS.map((api) => {
    const url = api.name === 'WeatherStack' ? api.url(lat, lon) : api.url;

    return axios
      .get(url)
      .then((response) => api.transformData(response.data))
      .catch((error) => {
        const errorMessage = error.response?.data?.error?.info || error.message;
        throw new APIError(500, `Error fetching data from ${api.name}`, {
          provider: api.name,
          message: errorMessage,
        });
      });
  });

  try {
    const weatherData = await Promise.all(fetchData);
    return { pinnedProviders, weatherData };
  } catch (err) {
    if (err instanceof APIError) {
      console.error('Custom API Error:', err.details);
    } else {
      console.error('Unexpected Error:', err);
    }
    throw err;
  }
}

module.exports = {
  fetchWeatherData,
};
