const FALLBACK_HOSPITALS = [
    {
      place_id: '1',
      name: 'Central Hospital',
      geometry: {
        location: {
          lat: 40.7128,
          lng: -74.0060
        }
      },
      vicinity: '123 Main St, New York, NY',
      distance: 1.2,
      details: {
        formatted_address: '123 Main St, New York, NY 10001',
        formatted_phone_number: '(212) 555-1234',
        website: 'https://centralhospital.org',
        opening_hours: { open_now: true }
      }
    },
    {
      place_id: '2',
      name: 'Mercy Medical Center',
      geometry: {
        location: {
          lat: 40.7145,
          lng: -74.0092
        }
      },
      vicinity: '456 Park Ave, New York, NY',
      distance: 1.8,
      details: {
        formatted_address: '456 Park Ave, New York, NY 10002',
        formatted_phone_number: '(212) 555-5678',
        website: 'https://mercymedical.org',
        opening_hours: { open_now: true }
      }
    }
  ];