import { StyleSheet, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const handleGoogleSignIn = () => {
    router.replace('/(tabs)/dashboard');
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeIn.delay(500).duration(1000)}
        style={styles.content}
      >
        <Image 
          source={require('@/assets/images/loging-top-img.png')}
          style={styles.image}
          resizeMode="contain"
        />
        
        <ThemedText style={styles.title}>Smart City</ThemedText>
        <ThemedText style={styles.subtitle}>
            Safety & Emergency Response System
        </ThemedText>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleGoogleSignIn}
        >
          <AntDesign name="google" size={24} color="white" style={styles.googleIcon} />
          <ThemedText style={styles.buttonText}>
            Continue with Google
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: width * 0.85,
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#4285F4",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  googleIcon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
}); 