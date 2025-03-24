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

export const renderDoctor = ({ item }) => {
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
      style={styles.card}
      activeOpacity={0.7}
    >
      {/* Doctor Icon and Status Indicator */}
      <View style={styles.iconContainer}>
        <MaterialIcons name="medical-services" size={28} color={Colors.doctorPurple} />
        {item.details?.opening_hours && (
          <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
        )}
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
      </View>

      {/* Doctor Information */}
      <View style={styles.infoContainer}>
        <Text style={styles.address} numberOfLines={2}>{item.details?.formatted_address || item.vicinity || 'Address not available'}</Text>

        <View style={styles.detailsRow}>
          {/* Distance */}
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color={Colors.doctorPurple} />
            <Text style={styles.detailText}>{item.distance?.toFixed(2)} km</Text>
          </View>

          {/* Phone Number */}
          {item.details?.formatted_phone_number && (
            <View style={styles.detailItem}>
              <Ionicons name="call" size={16} color={Colors.doctorPurple} />
              <Text style={styles.detailText}>{item.details.formatted_phone_number}</Text>
            </View>
          )}

          {/* Open/Closed Status */}
          {item.details?.opening_hours && (
            <View style={styles.detailItem}>
              <Ionicons name="time" size={16} color={statusColor} />
              <Text style={[styles.detailText, { color: statusColor }]}>{statusText}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.navigateButton]} onPress={handleNavigate}>
          <Ionicons name="navigate" size={20} color={Colors.white} />
          <Text style={styles.buttonText}>Navigate</Text>
        </TouchableOpacity>

        {item.details?.formatted_phone_number && (
          <TouchableOpacity style={[styles.actionButton, styles.callButton]} onPress={handleCall}>
            <Ionicons name="call" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Call</Text>
          </TouchableOpacity>
        )}

        {item.details?.website && (
          <TouchableOpacity style={[styles.actionButton, styles.websiteButton]} onPress={handleWebsite}>
            <Ionicons name="globe" size={20} color={Colors.white} />
            <Text style={styles.buttonText}>Website</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    marginHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: Colors.cardShadow,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 5,
      },
    }),
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10,
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  navigateButton: {
    backgroundColor: Colors.doctorPurple,
  },
  callButton: {
    backgroundColor: Colors.success,
  },
  websiteButton: {
    backgroundColor: Colors.accent,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
});
