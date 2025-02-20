# 🌆 Smart City - Safety & Emergency Response System

<p align="center">
  <i>Making cities safer through AI and community collaboration</i>
</p>

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)

## 📱 Overview

Smart City is a mobile application that enhances urban safety through AI-powered incident reporting and emergency response. The platform connects citizens with emergency services and law enforcement agencies in real-time, creating safer communities through technology.

## ✨ Key Features

- 🔐 **Secure Authentication**
  - Multi-role support (Citizens, Authorities, Admins)
  - Firebase authentication with social login

- 🚨 **Smart Incident Reporting**
  - AI-powered severity classification
  - Image/video upload with real-time analysis
  - Location-based tracking

- 🚑 **Emergency Response System**
  - One-tap emergency assistance
  - Real-time GPS tracking
  - Automated dispatch and notifications

- 📊 **Analytics Dashboard**
  - Crime heatmaps and trend analysis
  - Response time metrics
  - Predictive risk assessment

## 🛠️ Tech Stack

- **Frontend:** React Native Expo
- **Backend:** Firebase (Firestore, Auth, Functions)
- **AI/ML:** OpenAI API
- **Maps:** Google Maps Platform
- **APIs:** Crimeometer, OpenWeatherMap, Twilio

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/ayanpal7876/smart-city-app
cd smart-city-app
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Update .env with your API keys
```

4. Start the development server
```bash
npx expo start
```

## ⚙️ Environment Setup

Create a `.env` file with the following:

```env
# Firebase
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id

# APIs
OPENAI_API_KEY=your_key
GOOGLE_MAPS_API_KEY=your_key
CRIMEOMETER_API_KEY=your_key
TWILIO_ACCOUNT_SID=your_sid
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


---

<p align="center">
  Made with ❤️ for safer cities
</p>
