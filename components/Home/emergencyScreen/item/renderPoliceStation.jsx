import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
  Linking,
  Platform
} from 'react-native';
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Shadow } from '@/constants';

export const renderPoliceStation = ({ item }) => {
  const handleCall = () => {
    const phoneNumber = item.details.formatted_phone_number || '';
    Linking.openURL(`tel:${phoneNumber.replace(/[^0-9]/g, '')}`);
  };

  const handleDirections = () => {
    const lat = item.geometry?.location?.lat;
    const lng = item.geometry?.location?.lng;
    const label = encodeURIComponent(item.name);
    
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}&dirflg=d&t=m&q=${label}`,
      android: `google.navigation:q=${lat},${lng}&mode=d`
    });
    
    Linking.openURL(url).catch(() => {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
    });
  };

  const handleWebsite = () => {
    let website = item.details.website;
    if (!website.startsWith('http')) {
      website = `https://${website}`;
    }
    Linking.openURL(website);
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Ionicons name="shield" size={24} color={Colors.policeBlue} />
        <Text style={styles.stationName} numberOfLines={2}>{item.name}</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        {/* Address */}
        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={16} color={Colors.policeBlue} style={styles.icon} />
          <Text style={styles.detailText} numberOfLines={2}>
            {item.details.formatted_address || item.vicinity || "Address not available"}
          </Text>
        </View>
        
        {/* Distance */}
        <View style={styles.detailRow}>
          <FontAwesome name="location-arrow" size={16} color={Colors.policeBlue} style={styles.icon} />
          <Text style={styles.detailText}>
            {item.distance.toFixed(1)} km away
          </Text>
        </View>
        
        {/* Phone */}
        {item.details.formatted_phone_number && (
          <View style={styles.detailRow}>
            <FontAwesome name="phone" size={16} color={Colors.policeBlue} style={styles.icon} />
            <Text style={styles.detailText}>
              {item.details.formatted_phone_number}
            </Text>
          </View>
        )}
        
        {/* Hours */}
        {item.details.opening_hours && (
          <View style={styles.detailRow}>
            <FontAwesome name="clock-o" size={16} color={Colors.policeBlue} style={styles.icon} />
            <View style={styles.hoursContainer}>
              <Text style={[
                styles.hoursText,
                item.details.opening_hours.open_now 
                  ? styles.openText 
                  : styles.closedText
              ]}>
                {item.details.opening_hours.open_now ? 'Open Now' : 'Closed'}
              </Text>
              {item.details.opening_hours.weekday_text && (
                <Text style={styles.hoursSubtext}>
                  {item.details.opening_hours.weekday_text[new Date().getDay()]}
                </Text>
              )}
            </View>
          </View>
        )}
        
        {/* Rating */}
        {item.rating && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={16} color={Colors.star} style={styles.icon} />
            <Text style={styles.detailText}>
              {item.rating} / 5 ({item.user_ratings_total || 0} reviews)
            </Text>
          </View>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.directionsButton]}
          onPress={handleDirections}
          activeOpacity={0.8}
        >
          <MaterialIcons name="directions" size={18} color="white" />
          <Text style={styles.actionButtonText}>Directions</Text>
        </TouchableOpacity>
        
        {item.details.formatted_phone_number && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]}
            onPress={handleCall}
            activeOpacity={0.8}
          >
            <FontAwesome name="phone" size={16} color="white" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
        )}
        
        {item.details.website && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.websiteButton]}
            onPress={handleWebsite}
            activeOpacity={0.8}
          >
            <FontAwesome name="globe" size={16} color="white" />
            <Text style={styles.actionButtonText}>Website</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Shadow.medium,
    borderLeftWidth: 5,
    borderLeftColor: Colors.policeBlue,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    ...Typography.heading2,
    color: Colors.policeBlue,
    marginLeft: 10,
    flex: 1,
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 6,
  },
  icon: {
    marginTop: 2,
    width: 24,
  },
  detailText: {
    ...Typography.body,
    color: Colors.textSecondary,
    flex: 1,
    marginLeft: 8,
  },
  hoursContainer: {
    flex: 1,
    marginLeft: 8,
  },
  hoursText: {
    ...Typography.body,
    fontWeight: '500',
  },
  openText: {
    color: Colors.success,
  },
  closedText: {
    color: Colors.error,
  },
  hoursSubtext: {
    ...Typography.small,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.dividerLight,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    ...Shadow.small,
  },
  directionsButton: {
    backgroundColor: Colors.policeBlue,
  },
  callButton: {
    backgroundColor: Colors.success,
  },
  websiteButton: {
    backgroundColor: Colors.info,
  },
  actionButtonText: {
    ...Typography.button,
    fontSize: 14,
    color: 'white',
    marginLeft: 6,
  },
});