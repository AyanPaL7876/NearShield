import { StyleSheet, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function NotFoundScreen() {
  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeIn.delay(200).duration(1000)}
        style={styles.content}
      >
        <Image 
          source={require('@/assets/images/404.png')}
          style={styles.image}
          resizeMode="contain"
        />
        
        <ThemedText style={styles.title}>Oops!</ThemedText>
        <ThemedText style={styles.subtitle}>
          We can't seem to find the page you're looking for.
        </ThemedText>

        <Link href="/" asChild>
          <TouchableOpacity style={styles.button}>
            <AntDesign name="home" size={24} color="white" style={styles.icon} />
            <ThemedText style={styles.buttonText}>
              Go Back Home
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <ThemedText style={styles.errorCode}>
          404 - Page Not Found
        </ThemedText>
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
    height: width * 0.6,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },
  button: {
    backgroundColor: '#4285F4',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
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
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorCode: {
    marginTop: 48,
    fontSize: 16,
    color: '#999',
    fontFamily: 'monospace',
  },
});
