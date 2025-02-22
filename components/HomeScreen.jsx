import { 
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Image 
  } from 'react-native';
  import React from 'react';
  import { Colors } from '../constants/Colors';
  import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
  import { useUser } from '@clerk/clerk-expo';
  import { useNavigation } from '@react-navigation/native';
  
  const EmergencyCard = ({ icon, title, description, color, onPress }) => (
    <TouchableOpacity style={[styles.emergencyCard, { backgroundColor: color }]} onPress={onPress}>
      <View style={styles.emergencyIconContainer}>{icon}</View>
      <Text style={styles.emergencyTitle}>{title}</Text>
      <Text style={styles.emergencyDescription}>{description}</Text>
    </TouchableOpacity>
  );
  
  const HomeScreen = () => {
    const { user } = useUser();
    const navigation = useNavigation();
  
    const greeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good Morning';
      if (hour < 18) return 'Good Afternoon';
      return 'Good Evening';
    };
  
    return (
      <ScrollView style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}</Text>
            <Text style={styles.userName}>{user?.firstName || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
  
        {/* Emergency Services Section */}
        <View style={[styles.section , styles.boxTopRadius]}>
        {/* <View style={styles.section}> */}
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          <View style={styles.emergencyGrid}>
            <EmergencyCard
              icon={<MaterialIcons name="local-police" size={32} color="white" />}
              title="Police"
              description="Report crime or emergency"
              color="#FF6B6B"
              onPress={() => navigation.navigate('Police')}
            />
            <EmergencyCard
              icon={<FontAwesome5 name="ambulance" size={32} color="white" />}
              title="Ambulance"
              description="Medical emergency"
              color="#4ECDC4"
              onPress={() => navigation.navigate('Ambulance')}
            />
            <EmergencyCard
              icon={<MaterialIcons name="fire-truck" size={32} color="white" />}
              title="Fire"
              description="Fire emergency"
              color="#FFB347"
              onPress={() => navigation.navigate('Fire')}
            />
            <EmergencyCard
              icon={<MaterialIcons name="report" size={32} color="white" />}
              title="Report"
              description="Report an incident"
              color="#845EC2"
              onPress={() => navigation.navigate('Report')}
            />
          </View>
          <TouchableOpacity style={styles.viewMoreButton} onPress={() => navigation.navigate('EmergencyDetails')}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>
        {/* </View> */}
  
        {/* Recent Alerts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          <View style={styles.alertCard}>
            <MaterialIcons name="warning" size={24} color="#FFB347" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Flash Flood Warning</Text>
              <Text style={styles.alertDescription}>Heavy rainfall expected in your area</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewMoreButton} onPress={() => navigation.navigate('Alerts')}>
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        </View>
  
        {/* Safety Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.tipCard} onPress={() => navigation.navigate('EmergencyContacts')}>
              <Image source={require('../assets/images/safety-tip-2.png')} style={styles.tipImage} />
              <Text style={styles.tipTitle}>Emergency Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tipCard} onPress={() => navigation.navigate('FirstAidGuide')}>
              <Image source={require('../assets/images/safety-tip-1.png')} style={styles.tipImage} />
              <Text style={styles.tipTitle}>First Aid Guide</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 26,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: Colors.background,
      // borderBottomEndRadius: 25,
      // borderBottomStartRadius: 25,
    },
    greeting: {
      fontSize: 15,
      fontFamily: 'outfit',
      color: Colors.smallTextColor,
    },
    userName: {
      fontSize: 25,
      fontFamily: 'outfit-bold',
      color: Colors.dark.text,
    },
    notificationButton: {
      padding: 12,
      backgroundColor: '#f0f0f0',
      borderRadius: 50,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    section: {
      backgroundColor: '#fff',
      paddingHorizontal: 20,
    },
    boxTopRadius: {
      paddingVertical: 20,
      borderTopRightRadius:25,
      borderTopLeftRadius:25,
    },
    sectionTitle: {
      fontSize: 19,
      fontFamily: 'outfit-bold',
      marginBottom: 15,
      color: '#333',
    },
    emergencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    emergencyCard: {
      width: '48%',
      padding: 15,
      borderRadius: 15,
      marginBottom: 15,
      elevation: 5,
    },
    emergencyIconContainer: {
      marginBottom: 10,
    },
    emergencyTitle: {
      fontSize: 17,
      fontFamily: 'outfit-bold',
      color: 'white',
      marginBottom: 3,
    },
    emergencyDescription: {
      fontSize: 13,
      fontFamily: 'outfit',
      color: 'white',
      opacity: 0.9,
    },
    alertCard: {
      backgroundColor: '#FFF5E6',
      padding: 15,
      borderRadius: 15,
      flexDirection: 'row',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    alertContent: {
      marginLeft: 15,
      flex: 1,
    },
    alertTitle: {
      fontSize: 15,
      fontFamily: 'outfit-bold',
      color: '#333',
    },
    alertDescription: {
      fontSize: 13,
      fontFamily: 'outfit',
      color: '#666',
    },
    viewMoreButton: {
      marginTop: 10,
      alignSelf: 'flex-end',
      padding: 8,
    },
    viewMoreText: {
      fontSize: 15,
      fontFamily: 'outfit-bold',
      color: '#000',
    },
    tipCard: {
      width: 150,
      marginRight: 15,
      borderRadius: 15,
      overflow: 'hidden',
    },
    tipImage: {
      width: '100%',
      height: 100,
      borderRadius: 15,
    },
    tipTitle: {
      fontSize: 15,
      fontFamily: 'outfit-medium',
      color: '#333',
      marginTop: 10,
    },
  });
  
  export default HomeScreen;
  