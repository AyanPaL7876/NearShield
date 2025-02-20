import { useEffect } from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Google from 'expo-auth-session/providers/google';
import { IconSymbol } from '@/components/ui/IconSymbol';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  // Add Google Sign In logic here later
  const handleGoogleSignIn = () => {
    // Temporarily navigate to tabs for testing
    router.replace('/(tabs)');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/smart-city-logo.png')} // Add your logo
          style={styles.logo}
        />
        <ThemedText type="title" style={styles.title}>
          Smart City
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          AI-Powered Safety & Emergency Response
        </ThemedText>
      </ThemedView>

      <TouchableOpacity 
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
      >
        <Image 
          source={require('../assets/images/google-logo.png')} // Add Google logo
          style={styles.googleIcon}
        />
        <ThemedText style={styles.buttonText}>
          Continue with Google
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 50,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});