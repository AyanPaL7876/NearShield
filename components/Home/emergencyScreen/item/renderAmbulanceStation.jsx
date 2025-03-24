import React from 'react';
import { 
  View,
  StyleSheet, 
  TouchableOpacity, 
  Text,
  Linking,
  Platform
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors, Shadow, Typography } from '@/constants';
import { navigateToStation, callStation, openWebsite } from '@/utils/SiteOpen';

export const renderAmbulanceStation = ({ item }) => {
  const isOpen = item.details?.opening_hours?.open_now;
  const statusColor = isOpen ? Colors.success : Colors.error;
  const statusText = isOpen ? 'Open' : 'Closed';
  
  const handleNavigate = () => {
    navigateToStation(item);
  };
  
  const handleCall = () => {
    if (item.details?.formatted_phone_number) {
      callStation(item.details.formatted_phone_number);
    }
  };
  
  const handleWebsite = () => {
    if (item.details?.website) {
      openWebsite(item.details.website);
    }
  };

  return (
    <TouchableOpacity
      style={styles.stationCard}
      activeOpacity={0.7}
    >
      {/* Station Icon and Status Indicator */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="local-hospital" size={28} color={Colors.ambulanceYellow} />
        {item.details?.opening_hours && (
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        )}
      </View>
      
      {/* Station Information */}
      <View style={styles.stationInfo}>
        <Text style={styles.stationName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.stationAddress} numberOfLines={2}>
          {item.details?.formatted_address || item.vicinity || 'Address not available'}
        </Text>
        
        <View style={styles.detailsContainer}>
          {/* Distance */}
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color={Colors.ambulanceYellow} />
            <Text style={styles.detailText}>{item.distance?.toFixed(2)} km</Text>
          </View>
          
          {/* Phone Number */}
          {item.details?.formatted_phone_number && (
            <View style={styles.detailItem}>
              <Ionicons name="call" size={16} color={Colors.ambulanceYellow} />
              <Text style={styles.detailText} numberOfLines={1}>
                {item.details.formatted_phone_number}
              </Text>
            </View>
          )}
          
          {/* Open/Closed Status */}
          {item.details?.opening_hours && (
            <View style={styles.detailItem}>
              <Ionicons 
                name="time" 
                size={16} 
                color={statusColor} 
              />
              <Text style={[styles.detailText, { color: statusColor }]}>
                {statusText}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {/* Directions Button */}
        <TouchableOpacity 
          style={[styles.actionButton, styles.directionsButton]}
          onPress={handleNavigate}
          activeOpacity={0.8}
        >
          <Ionicons name="navigate" size={20} color={Colors.white} />
          <Text style={styles.buttonText}>Directions</Text>
        </TouchableOpacity>

        {/* Call Button */}
        {item.details?.formatted_phone_number && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <Ionicons name="call" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        )}

        {/* Website Button */}
        {item.details?.website && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.websiteButton]}
            onPress={handleWebsite}
            activeOpacity={0.8}
          >
            <Ionicons name="globe" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Website</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stationCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 10,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 6,
  },
  stationAddress: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.tertiaryText,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  directionsButton: {
    backgroundColor: Colors.ambulanceYellow,
  },
  callButton: {
    backgroundColor: Colors.success,
  },
  websiteButton: {
    backgroundColor: Colors.accent,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 6,
  }
});