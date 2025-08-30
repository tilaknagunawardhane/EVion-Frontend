/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Degrees
 * @returns {number} Radians
 */
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
};

/**
 * Get map region for given coordinates and zoom level
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {number} zoom - Zoom level (1-20)
 * @returns {object} Map region object
 */
export const getMapRegion = (latitude, longitude, zoom = 15) => {
  const delta = Math.exp(Math.log(360) - (zoom * Math.LN2));
  return {
    latitude,
    longitude,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
};

/**
 * Check if coordinates are valid
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinate = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

/**
 * Get bounds for multiple coordinates
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @returns {object} Bounds object with min/max lat/lng
 */
export const getCoordinatesBounds = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  let minLat = coordinates[0].latitude;
  let maxLat = coordinates[0].latitude;
  let minLng = coordinates[0].longitude;
  let maxLng = coordinates[0].longitude;

  coordinates.forEach(coord => {
    minLat = Math.min(minLat, coord.latitude);
    maxLat = Math.max(maxLat, coord.latitude);
    minLng = Math.min(minLng, coord.longitude);
    maxLng = Math.max(maxLng, coord.longitude);
  });

  return {
    minLat,
    maxLat,
    minLng,
    maxLng,
  };
};

/**
 * Get center point of multiple coordinates
 * @param {Array} coordinates - Array of {latitude, longitude} objects
 * @returns {object} Center coordinate {latitude, longitude}
 */
export const getCenterOfCoordinates = (coordinates) => {
  if (!coordinates || coordinates.length === 0) {
    return null;
  }

  if (coordinates.length === 1) {
    return coordinates[0];
  }

  const bounds = getCoordinatesBounds(coordinates);
  if (!bounds) return null;

  return {
    latitude: (bounds.minLat + bounds.maxLat) / 2,
    longitude: (bounds.minLng + bounds.maxLng) / 2,
  };
};

/**
 * Filter coordinates by distance from a center point
 * @param {Array} coordinates - Array of coordinate objects with latitude/longitude
 * @param {object} center - Center point {latitude, longitude}
 * @param {number} maxDistance - Maximum distance in kilometers
 * @returns {Array} Filtered coordinates
 */
export const filterCoordinatesByDistance = (coordinates, center, maxDistance) => {
  if (!coordinates || !center || !maxDistance) {
    return coordinates || [];
  }

  return coordinates.filter(coord => {
    const distance = getDistanceFromLatLonInKm(
      center.latitude,
      center.longitude,
      coord.latitude,
      coord.longitude
    );
    return distance <= maxDistance;
  });
};