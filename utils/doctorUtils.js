import * as Location from 'expo-location';
import { calculateDistance } from '@/lib/math';

export const getLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  return await Location.getCurrentPositionAsync({});
};

export const constructAddress = (tags) => {
  if (!tags) return 'Address not available';

  const addressParts = [];
  if (tags['addr:housenumber']) addressParts.push(tags['addr:housenumber']);
  if (tags['addr:street']) addressParts.push(tags['addr:street']);
  if (tags['addr:city']) addressParts.push(tags['addr:city']);
  if (tags['addr:postcode']) addressParts.push(tags['addr:postcode']);

  if (addressParts.length === 0) {
    if (tags.address) return tags.address;
    if (tags.name) return `${tags.name} location`;
    return 'Address not available';
  }

  return addressParts.join(', ');
};

export const fetchDoctors = async (
  latitude,
  longitude,
  searchRadius,
  useFallbackData,
  location,
  fallbackDoctors
) => {
  if (useFallbackData || (!latitude && !longitude)) {
    return { doctors: [], usedFallback: true };
  }

  try {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node(around:${searchRadius},${latitude},${longitude})["amenity"="doctors"];);out body;`;
    console.log('Fetching URL:', url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();

    if (data?.elements?.length > 0) {
      const doctorsWithDistance = data.elements.map(doctor => {
        const distance = calculateDistance(latitude, longitude, doctor.lat, doctor.lon);
        const tags = doctor.tags ?? {};

        return {
          place_id: doctor.id.toString(),
          name: tags.name || 'Doctor',
          geometry: {
            location: {
              lat: doctor.lat,
              lng: doctor.lon
            }
          },
          vicinity: constructAddress(tags) || 'Unknown Location',
          distance: distance,
          details: {
            formatted_address: constructAddress(tags) || 'Address not available',
            formatted_phone_number: tags.phone || tags['contact:phone'] || null,
            website: tags.website || null,
            opening_hours: tags.opening_hours ? { open_now: true } : null
          }
        };
      });

      return { 
        doctors: doctorsWithDistance.sort((a, b) => a.distance - b.distance),
        usedFallback: false 
      };
    } else {
      const fallbackWithDistances = fallbackDoctors.map(doctor => {
        return {
          ...doctor,
          distance: calculateDistance(
            latitude,
            longitude,
            doctor.geometry.location.lat,
            doctor.geometry.location.lng
          )
        };
      });

      return { 
        doctors: fallbackWithDistances,
        usedFallback: true 
      };
    }
  } catch (error) {
    console.error('API Error:', error);

    const fallbackWithDistances = fallbackDoctors.map(doctor => {
      return {
        ...doctor,
        distance: location ?
          calculateDistance(
            location.coords.latitude,
            location.coords.longitude,
            doctor.geometry.location.lat,
            doctor.geometry.location.lng
          ) :
          doctor.distance
      };
    });

    return { 
      doctors: fallbackWithDistances,
      usedFallback: true 
    };
  }
};
