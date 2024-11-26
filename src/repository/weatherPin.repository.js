const WeatherPinModel = require('../models/weatherPin.model');

async function toggleWeatherProviderPin(
  provider,
  city,
  temperature,
  condition,
  isPinned
) {
  try {
    const updatedProvider = await WeatherPinModel.findOneAndUpdate(
      { provider },
      {
        $set: { city, temperature, condition },
      },
      {
        new: true,
        upsert: true,
      }
    );

    if (isPinned) {
      if (updatedProvider) {
        await WeatherPinModel.deleteOne({ provider });
        return { provider, isPinned: false };
      } else {
        throw new Error('Provider not found for unpinning');
      }
    }

    return { provider: updatedProvider.provider, isPinned: true };
  } catch (err) {
    console.error('Error toggling pin:', err.message);
    throw err;
  }
}

async function fetchPinnedProviders() {
  const pinnedProviders = await WeatherPinModel.find();
  return pinnedProviders.map((doc) => ({
    provider: doc.provider,
    city: doc.city,
    temperature: doc.temperature,
    condition: doc.condition,
  }));
}

module.exports = {
  toggleWeatherProviderPin,
  fetchPinnedProviders,
};
