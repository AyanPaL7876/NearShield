import React from 'react';
import { 
  View,
  StyleSheet, 
  TouchableOpacity, 
  Text
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Shadow, Typography } from '@/constants';
import { navigateToStation } from '@/utils/SiteOpen';

export const renderFireStation = ({ item }) => (
  <TouchableOpacity
    style={styles.stationCard}
  >
    <View style={styles.stationInfo}>
      <View style={styles.stationDetailsRow}>
      <MaterialIcons name="local-fire-department" size={24} color={Colors.fireRed} />
      <Text style={styles.stationName}>{item.name}</Text>
      </View>
      <Text style={styles.stationAddress}>{item.details?.formatted_address || item.vicinity || 'Address not available'}</Text>
      
      <View style={styles.stationDetailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color={Colors.fireRed} />
          <Text style={styles.detailText}>{item.distance?.toFixed(2)} km</Text>
        </View>
        
        {item.details?.formatted_phone_number && (
          <View style={styles.detailItem}>
            <Ionicons name="call" size={16} color={Colors.fireRed} />
            <Text style={styles.detailText}>{item.details.formatted_phone_number}</Text>
          </View>
        )}
        
        {item.details?.opening_hours && (
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
  stationCard: {
    backgroundColor: Colors.cardBg,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...Shadow.medium,
      marginHorizontal: 16,
      marginVertical: 8,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    ...Typography.subtitle,
    marginBottom: 4,
  },
  stationAddress: {
    ...Typography.caption,
    marginBottom: 8,
    marginLeft: 24,
  },
  stationDetailsRow: {
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
    backgroundColor: Colors.fireRed,
    borderRadius: 8,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
