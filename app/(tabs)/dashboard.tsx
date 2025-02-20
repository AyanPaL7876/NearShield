import { StyleSheet, Dimensions, ScrollView, Platform, View, RefreshControl } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { 
  MaterialCommunityIcons, 
  Ionicons, 
  FontAwesome5, 
  Feather,
  MaterialIcons 
} from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { router } from 'expo-router';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#0A84FF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  info: '#64D2FF',
  background: {
    light: '#F2F2F7',
    dark: '#000000'
  },
  card: {
    light: '#FFFFFF',
    dark: '#1C1C1E'
  },
  text: {
    light: {
      primary: '#000000',
      secondary: '#3C3C43',
      tertiary: '#787880'
    },
    dark: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5',
      tertiary: '#EBEBF599'
    }
  },
  border: {
    light: '#E5E5EA',
    dark: '#38383A'
  }
};

// Enhanced Emergency Card Component
const EmergencyCard = ({ icon, title, description, color, onPress, isActive, isDark }: {
  icon: React.ReactNode,
  title: string,
  description: string,
  color: string,
  onPress?: () => void,
  isActive?: boolean,
  isDark: boolean
}) => (
  <TouchableOpacity 
    style={[
      styles.card,
      { 
        backgroundColor: isDark ? COLORS.card.dark : COLORS.card.light,
        borderColor: color,
        borderWidth: isActive ? 2 : 0
      }
    ]}
    onPress={onPress}
  >
    <Animated.View entering={FadeInDown.duration(600)}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        {icon}
      </View>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <ThemedText style={styles.cardDescription}>{description}</ThemedText>
    </Animated.View>
  </TouchableOpacity>
);

// Stats Card Component
const StatsCard = ({ icon, title, value, color, isDark }: {
  icon: React.ReactNode,
  title: string,
  value: string,
  color: string,
  isDark: boolean
}) => (
  <ThemedView style={[styles.statsCard, { 
    backgroundColor: isDark ? COLORS.card.dark : COLORS.card.light,
    shadowColor: Platform.OS === 'ios' ? '#000000' : 'transparent'
  }]}>
    <View style={[styles.statsIcon, { backgroundColor: color }]}>
      {icon}
    </View>
    <ThemedText style={styles.statsValue}>{value}</ThemedText>
    <ThemedText style={styles.statsTitle}>{title}</ThemedText>
  </ThemedView>
);

// Component for Alert Cards
const AlertCard = ({ type, message, time, color, isDark }: {
  type: string,
  message: string,
  time: string,
  color: string,
  isDark: boolean
}) => (
  <ThemedView style={[
    styles.alertCard, 
    { 
      borderLeftColor: color,
      backgroundColor: isDark ? COLORS.card.dark : COLORS.card.light
    }
  ]}>
    <ThemedText style={[styles.alertType, { color: isDark ? '#FFFFFF' : '#000000' }]}>
      {type}
    </ThemedText>
    <ThemedText style={[styles.alertMessage, { color: isDark ? '#EBEBF5' : '#3C3C43' }]}>
      {message}
    </ThemedText>
    <ThemedText style={[styles.alertTime, { color: isDark ? '#EBEBF599' : '#787880' }]}>
      {time}
    </ThemedText>
  </ThemedView>
);

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const deviceColorScheme = useDeviceColorScheme();
  const isDark = deviceColorScheme === 'dark';
  
  // Get theme-specific colors
  const backgroundColor = isDark ? COLORS.background.dark : COLORS.background.light;
  const cardBackground = isDark ? COLORS.card.dark : COLORS.card.light;
  const textColor = isDark ? COLORS.text.dark : COLORS.text.light;
  const borderColor = isDark ? COLORS.border.dark : COLORS.border.light;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleServicePress = (service: string) => {
    setActiveService(service);
    // Add your navigation logic here
  };

  const handleGuidelinesPress = () => {
    router.push('/(tabs)/guidelines' as any);
  };

  const handleFacilitiesPress = () => {
    router.push('/(tabs)/facilities' as any);
  };

  const handleAIAnalysisPress = () => {
    router.push('/(tabs)/ai-analysis' as any);
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDark ? '#FFFFFF' : COLORS.primary}
          />
        }
      >
        <Animated.View 
          entering={FadeIn.delay(200).duration(1000)}
          style={styles.content}
        >
          {/* Header Section */}
          <View style={[styles.header, { 
            backgroundColor: cardBackground,
            borderColor: borderColor 
          }]}>
            <View style={styles.headerIcon}>
              <MaterialCommunityIcons 
                name="shield-check" 
                size={32} 
                color={COLORS.primary} 
              />
            </View>
            <View style={styles.headerText}>
              <ThemedText style={[styles.welcomeText, { color: textColor.tertiary }]}>
                Welcome Back,
              </ThemedText>
              <ThemedText style={[styles.nameText, { color: textColor.primary }]}>
                Ayan
              </ThemedText>
            </View>
            <TouchableOpacity style={[styles.profileButton, { backgroundColor: COLORS.primary }]}>
              <Feather name="user" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <StatsCard 
              icon={<Ionicons name="alert-circle" size={24} color="white" />}
              title="Active Alerts"
              value="3"
              color={COLORS.danger}
              isDark={isDark}
            />
            <StatsCard 
              icon={<Ionicons name="checkmark-circle" size={24} color="white" />}
              title="Resolved"
              value="28"
              color={COLORS.success}
              isDark={isDark}
            />
          </View>

          {/* Latest Alerts Section */}
          <ThemedText style={[styles.sectionTitle, { color: textColor.primary }]}>
            Latest Alerts
          </ThemedText>
          <AlertCard 
            type="Weather Alert"
            message="Heavy rainfall expected in your area"
            time="10 minutes ago"
            color={COLORS.warning}
            isDark={isDark}
          />
          <AlertCard 
            type="Crime Alert"
            message="Suspicious activity reported nearby"
            time="30 minutes ago"
            color={COLORS.danger}
            isDark={isDark}
          />

          {/* Emergency Services Section */}
          <ThemedText style={[styles.sectionTitle, { color: textColor.primary }]}>
            Emergency Services
          </ThemedText>
          <View style={styles.servicesGrid}>
            <EmergencyCard 
              icon={<MaterialCommunityIcons name="ambulance" size={32} color="white" />}
              title="Medical"
              description="Request immediate medical assistance"
              color={COLORS.danger}
              isActive={activeService === 'medical'}
              onPress={() => handleServicePress('medical')}
              isDark={isDark}
            />
            <EmergencyCard 
              icon={<Ionicons name="flame" size={32} color="white" />}
              title="Fire"
              description="Report a fire emergency"
              color={COLORS.warning}
              isActive={activeService === 'fire'}
              onPress={() => handleServicePress('fire')}
              isDark={isDark}
            />
            <EmergencyCard 
              icon={<FontAwesome5 name="hand-holding-medical" size={32} color="white" />}
              title="First Aid"
              description="Access first aid guides"
              color={COLORS.success}
              isActive={activeService === 'firstaid'}
              onPress={() => handleServicePress('firstaid')}
              isDark={isDark}
            />
            <EmergencyCard 
              icon={<MaterialCommunityIcons name="police-badge" size={32} color="white" />}
              title="Police"
              description="Contact law enforcement"
              color={COLORS.primary}
              isActive={activeService === 'police'}
              onPress={() => handleServicePress('police')}
              isDark={isDark}
            />
          </View>

          {/* Quick Actions Section */}
          <ThemedText style={[styles.sectionTitle, { color: textColor.primary }]}>
            Quick Actions
          </ThemedText>
          <View style={styles.quickActions}>
            <TouchableOpacity style={[
              styles.actionButton,
              { backgroundColor: cardBackground }
            ]}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primary }]}>
                <Ionicons name="location" size={24} color="white" />
              </View>
              <ThemedText style={styles.actionText}>Share Location</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={[
              styles.actionButton,
              { backgroundColor: cardBackground }
            ]}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.secondary }]}>
                <MaterialCommunityIcons name="contacts" size={24} color="white" />
              </View>
              <ThemedText style={styles.actionText}>Emergency Contacts</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Safety Resources Section */}
          <ThemedText style={[styles.sectionTitle, { color: textColor.primary }]}>
            Safety Resources
          </ThemedText>
          <TouchableOpacity 
            style={[
              styles.tipCard,
              { 
                backgroundColor: cardBackground,
                borderColor: borderColor,
                borderWidth: 1
              }
            ]}
            onPress={handleGuidelinesPress}
          >
            <ThemedView style={styles.tipHeader}>
              <ThemedText style={[styles.tipTitle, { color: textColor.primary }]}>
                Emergency Guidelines
              </ThemedText>
              <Feather name="chevron-right" size={20} color={textColor.primary} />
            </ThemedView>
            <ThemedText style={[styles.tipDescription, { color: textColor.secondary }]}>
              Access comprehensive guides for various emergency situations
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.tipCard,
              { 
                backgroundColor: cardBackground,
                borderColor: borderColor,
                borderWidth: 1
              }
            ]}
            onPress={handleFacilitiesPress}
          >
            <ThemedView style={styles.tipHeader}>
              <ThemedText style={[styles.tipTitle, { color: textColor.primary }]}>
                Nearby Facilities
              </ThemedText>
              <Feather name="chevron-right" size={20} color={textColor.primary} />
            </ThemedView>
            <ThemedText style={[styles.tipDescription, { color: textColor.secondary }]}>
              Find hospitals, police stations, and fire stations near you
            </ThemedText>
          </TouchableOpacity>

          {/* AI Features Section */}
          <ThemedText style={[styles.sectionTitle, { color: textColor.primary }]}>
            Smart Features
          </ThemedText>
          <TouchableOpacity 
            style={[
              styles.aiCard,
              { backgroundColor: cardBackground }
            ]}
            onPress={handleAIAnalysisPress}
          >
            <MaterialIcons name="analytics" size={24} color={COLORS.primary} />
            <ThemedView style={styles.aiContent}>
              <ThemedText style={[styles.aiTitle, { color: textColor.primary }]}>
                AI-Powered Analysis
              </ThemedText>
              <ThemedText style={[styles.aiDescription, { color: textColor.secondary }]}>
                Get intelligent insights and predictions for your area
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerIcon: {
    padding: 12,
    borderRadius: 16,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    opacity: 0.7,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 12,
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Platform.OS === 'ios' ? '#000000' : 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsIcon: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statsTitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Platform.OS === 'ios' ? '#000000' : 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    width: (width - 48) / 2,
    shadowColor: Platform.OS === 'ios' ? '#000000' : 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionIcon: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tipCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tipDescription: {
    fontSize: 14,
    color: '#666',
  },
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  aiContent: {
    marginLeft: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  aiDescription: {
    fontSize: 14,
    color: '#666',
  },
  alertCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: Platform.OS === 'ios' ? '#000000' : 'transparent',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    marginBottom: 8,
  },
  alertTime: {
    fontSize: 12,
    opacity: 0.7,
  },
}); 