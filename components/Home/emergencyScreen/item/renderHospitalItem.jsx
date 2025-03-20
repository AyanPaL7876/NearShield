import React from 'react';
import { 
  View,
  StyleSheet, 
  TouchableOpacity, 
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadow, Typography } from '@/constants';
import { navigateToStation } from '@/utils/SiteOpen';

export const renderHospitalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.hospitalCard}
    //   onPress={() => handleHospitalPress(item)}
    >
      <View style={styles.hospitalInfo}>
        <Text style={styles.hospitalName}>{item.name}</Text>
        <Text style={styles.hospitalAddress}>{item.vicinity}</Text>
        
        <View style={styles.hospitalDetailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color={Colors.hospitalGreen} />
            <Text style={styles.detailText}>{item.distance} km</Text>
          </View>
          
          {item.details.formatted_phone_number && (
            <View style={styles.detailItem}>
              <Ionicons name="call" size={16} color={Colors.hospitalGreen} />
              <Text style={styles.detailText}>{item.details.formatted_phone_number}</Text>
            </View>
          )}
          
          {item.details.opening_hours && (
            <View style={styles.detailItem}>
              <Ionicons 
                name="time" 
                size={16} 
                color={item.details.opening_hours.open_now ? Colors.success : Colors.error} 
              />
              <Text 
                style={[
                  styles.detailText, 
                  {color: item.details.opening_hours.open_now ? Colors.success : Colors.error}
                ]}
              >
                {item.details.opening_hours.open_now ? 'Open' : 'Closed'}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.directionsButton}
        onPress={() => navigateToStation(item)}
      >
        <Ionicons name="navigate" size={20} color={Colors.white} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    hospitalCard: {
      backgroundColor: Colors.cardBg,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...Shadow.medium,
    },
    hospitalInfo: {
      flex: 1,
    },
    hospitalName: {
      ...Typography.subtitle,
      marginBottom: 4,
    },
    hospitalAddress: {
      ...Typography.caption,
      marginBottom: 8,
    },
    hospitalDetailsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      marginTop: 4,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 12,
      marginBottom: 4,
    },
    detailText: {
      ...Typography.caption,
      marginLeft: 4,
    },
    directionsButton: {
      backgroundColor: Colors.hospitalGreen,
      borderRadius: 8,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
    }
  });