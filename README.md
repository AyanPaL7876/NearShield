# 🚨 NearShield - Emergency Response App

<!-- ![NearShield Banner](https://via.placeholder.com/1200x400/1a237e/ffffff?text=NearShield+Safety+App) *(replace with actual banner image)* -->

**NearShield** is a real-time emergency assistant and reporting mobile application built using **Expo** (React Native). It aims to provide safety, emergency alerting, and crowd-sourced incident reporting features for users based on their current location..

## ✨ Features

### 🆘 Emergency Services Locator
- 👮 Police Stations (Overpass API)
- 🏥 Hospitals (Overpass API)
- 🚒 Fire Stations (Overpass API)
- 🚑 Ambulances (Overpass API)
- 👨‍⚕️ Doctors (Overpass API)

### 🌦️ Real-time Weather
- Current conditions (OpenWeatherMap API)
- Severe weather alerts

### 📢 Incident Reporting
- 📸 Photo uploads (Cloudinary)
- 📍 Map markers (Mapbox)
- 📝 Status updates

## 🛠 Tech Stack

### Frontend
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

### Backend
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

### APIs
![Mapbox](https://img.shields.io/badge/Mapbox-000000?style=for-the-badge&logo=mapbox&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-EE6E4E?style=for-the-badge&logo=openweathermap&logoColor=white)
![Overpass API](https://img.shields.io/badge/Overpass_API-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)

## 📸 Screenshots

| Feature | Preview |
|---------|---------|
| Emergency Map | ![Map](https://via.placeholder.com/300x600?text=Map+View) |
| Incident Report | ![Report](https://via.placeholder.com/300x600?text=Report+Screen) |
| Weather | ![Weather](https://via.placeholder.com/300x600?text=Weather+Data) |

## 🚀 Installation

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/NearShield.git
cd NearShield
```

### 2. Install dependencies
```bash
# Using npm
npm install

# OR using Yarn
yarn install
```

### 3. Environment Setup
#### Edit the .env file with your credentials:
```bash
# Mapbox Configuration
MAPBOX_API_KEY=your_mapbox_public_key

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# OpenWeatherMap API
OPENWEATHER_API_KEY=your_weather_api_key

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 4. Run the Application
```bash
# Start the development server
expo start

# For Android
expo start --android
```

## 🧪 Testing the App
### Run Unit Tests
```bash
npm test
```
### Test on Physical Device
#### 1. Install Expo Go app on your phone

#### 2. Scan the QR code from the terminal

#### 3. Make sure your phone and computer are on same network

### Test on Emulator
```bash
# For Android
expo start --android
```


## 📱 Supported Platforms
- Android 10.0+ 


## 🙏 Acknowledgments
- Mapbox for mapping services
- Firebase for backend support
<!-- - OpenStreetMap for location data -->