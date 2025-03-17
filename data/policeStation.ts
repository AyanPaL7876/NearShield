export const FALLBACK_POLICE_STATIONS = [
    {
      place_id: "fallback1",
      name: "Central Police Station",
      geometry: {
        location: {
          lat: 37.7749,
          lng: -122.4194
        }
      },
      vicinity: "123 Main St, City Center",
      distance: 2.5,
      details: {
        formatted_address: "123 Main St, City Center, 10001",
        formatted_phone_number: "555-123-4567",
        website: "https://police.gov/central",
        opening_hours: { open_now: true }
      }
    },
    {
      place_id: "fallback2",
      name: "Downtown Police Department",
      geometry: {
        location: {
          lat: 37.7833,
          lng: -122.4167
        }
      },
      vicinity: "456 Oak Ave, Downtown",
      distance: 3.8,
      details: {
        formatted_address: "456 Oak Ave, Downtown, 10002",
        formatted_phone_number: "555-987-6543",
        website: null,
        opening_hours: { open_now: true }
      }
    }
  ];