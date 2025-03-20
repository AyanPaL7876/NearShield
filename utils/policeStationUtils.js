import * as Location from 'expo-location';
import { calculateDistance } from '@/lib/math';


export const getLocationPermission = async () => {
  // Request location permissions
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return null;
  }

  // Get current location
  return await Location.getCurrentPositionAsync({});
};


export const constructAddress = (tags) => {
  if (!tags) return "Address not available";
  
  const addressParts = [];
  
  if (tags["addr:housenumber"]) addressParts.push(tags["addr:housenumber"]);
  if (tags["addr:street"]) addressParts.push(tags["addr:street"]);
  if (tags["addr:city"]) addressParts.push(tags["addr:city"]);
  if (tags["addr:postcode"]) addressParts.push(tags["addr:postcode"]);
  
  // If we don't have structured address parts, try to use other available address info
  if (addressParts.length === 0) {
    if (tags.address) return tags.address;
    if (tags.name) return `${tags.name} location`;
    return "Address not available";
  }
  return addressParts.join(", ");
};

export const fetchPoliceStations = async (
  latitude, 
  longitude, 
  searchRadius, 
  useFallbackData, 
  location, 
  fallbackStations
) => {
  // If already using fallback data or coordinates are invalid, return empty
  if (useFallbackData || (!latitude && !longitude)) {
    return { stations: [], usedFallback: true };
  }

  try {
    // Use a more flexible query to find police stations
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node(around:${searchRadius},${latitude},${longitude})["amenity"="police"];node(around:${searchRadius},${latitude},${longitude})["office"="police"];);out body;`;
    console.log("Fetching URL:", url);
    
    const response = await fetch(url);
    console.log("Response Status:", response.status);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Number of police stations found:", data?.elements?.length);

    if (data?.elements?.length > 0) {
      const stationsWithDistance = data.elements.map(station => {
        const distance = calculateDistance(latitude, longitude, station.lat, station.lon);
        const tags = station.tags ?? {}; // Handle missing tags

        return {
          place_id: station.id.toString(),
          name: tags.name || "Police Station", 
          geometry: {
            location: {
              lat: station.lat,
              lng: station.lon
            }
          },
          vicinity: constructAddress(tags) || "Unknown Location",
          distance: distance,
          details: {
            formatted_address: constructAddress(tags) || "Address not available",
            formatted_phone_number: tags.phone || tags["contact:phone"] || null,
            website: tags.website || null,
            opening_hours: tags.opening_hours ? { open_now: true } : null
          }
        };
      });

      return { 
        stations: stationsWithDistance.sort((a, b) => a.distance - b.distance),
        usedFallback: false 
      };
    } else {
      // No stations found, try with a larger radius
      if (searchRadius < 50000) {
        const newRadius = 50000; // Increase to 50km
        return { 
          newRadius,
          ...(await fetchPoliceStations(latitude, longitude, newRadius, useFallbackData, location, fallbackStations))
        };
      }
      
      // Use fallback data with adjusted distances
      const fallbackWithDistances = fallbackStations.map(station => {
        return {
          ...station,
          distance: calculateDistance(
            latitude, 
            longitude, 
            station.geometry.location.lat, 
            station.geometry.location.lng
          )
        };
      });
      
      return { 
        stations: fallbackWithDistances,
        usedFallback: true 
      };
    }
  } catch (error) {
    console.error("API Error:", error);
    
    // Use fallback data on error
    const fallbackWithDistances = fallbackStations.map(station => {
      return {
        ...station,
        distance: location ? 
          calculateDistance(
            location.coords.latitude, 
            location.coords.longitude, 
            station.geometry.location.lat, 
            station.geometry.location.lng
          ) :
          station.distance
      };
    });
    
    return { 
      stations: fallbackWithDistances,
      usedFallback: true 
    };
  }
};