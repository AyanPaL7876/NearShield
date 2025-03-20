export const fetchHospitalData = async (latitude, longitude, searchRadius) => {
  try {
    const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node(around:${searchRadius},${latitude},${longitude})["amenity"="hospital"];node(around:${searchRadius},${latitude},${longitude})["healthcare"="hospital"];);out body;`;
    console.log("Fetching URL:", url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    return data?.elements || [];
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


//   // Construct address from OpenStreetMap tags
//   const constructAddress = (tags) => {
//     let address = [];
    
//     if (tags.addr_housenumber) address.push(tags.addr_housenumber);
//     if (tags.addr_street) address.push(tags.addr_street);
//     if (tags.addr_city || tags.addr_suburb) address.push(tags.addr_city || tags.addr_suburb);
//     if (tags.addr_state) address.push(tags.addr_state);
//     if (tags.addr_postcode) address.push(tags.addr_postcode);
    
//     return address.length > 0 ? address.join(', ') : null;
//   };