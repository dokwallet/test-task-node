const { Schema, model } = require('mongoose');

const WeatherPinSchema = new Schema(
  {
    provider: {
      type: String,
      unique: true,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    temperature: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = model('PinnedWeatherProvider', WeatherPinSchema);
