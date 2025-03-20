import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity,
} from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Shadow } from '@/constants';
import { navigateToStation, callStation, openWebsite } from '@/utils/SiteOpen';


export const renderPoliceStation = ({ item }) => {
    return (
      <View style={styles.stationCard}>
        <Text style={styles.stationName}>{item.name}</Text>
        
        <View style={styles.detailRow}>
          <FontAwesome name="map-marker" size={16} color="#4A80F0" />
          <Text style={styles.detailText}>{item.details.formatted_address || item.vicinity || "Address not available"}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <FontAwesome name="location-arrow" size={16} color="#4A80F0" />
          <Text style={styles.detailText}>{item.distance.toFixed(2)} km away</Text>
        </View>
        
        {item.details.formatted_phone_number && (
          <View style={styles.detailRow}>
            <FontAwesome name="phone" size={16} color="#4A80F0" />
            <Text style={styles.detailText}>{item.details.formatted_phone_number}</Text>
          </View>
        )}
        
        {item.details.opening_hours && (
          <View style={styles.detailRow}>
            <FontAwesome name="clock-o" size={18} color="#4A80F0" />
            <Text style={styles.detailText}>
              {item.details.opening_hours.open_now ? 'Open Now' : 'Closed'}
            </Text>
          </View>
        )}
        
        {item.rating && (
          <View style={styles.detailRow}>
            <FontAwesome name="star" size={16} color="#FFD700" />
            <Text style={styles.detailText}>{item.rating} / 5</Text>
          </View>
        )}
        
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => navigateToStation(item)}
          >
            <MaterialIcons name="directions" size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Directions</Text>
          </TouchableOpacity>
          
          {item.details.formatted_phone_number && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => callStation(item.details.formatted_phone_number)}
            >
              <FontAwesome name="phone" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
          )}
          
          {item.details.website && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => openWebsite(item.details.website)}
            >
              <FontAwesome name="globe" size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Website</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
      // Card styles
      stationCard: {
        backgroundColor: Colors.cardBg,
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 16,
        paddingLeft: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.policeBlue,
        ...Shadow.medium,
      },
      stationName: {
        ...Typography.heading2,
        color: Colors.policeBlue,
        flex: 1,
      },
      
      // Detail styles
      detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
        gap: 8,
      },
      detailText: {
        ...Typography.body,
        color: Colors.textSecondary,
      },
      
      // Action buttons
      actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
      },
      actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.policeLightBlue,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 8,
        flex: 1,
        marginHorizontal: 4,
        ...Shadow.small,
      },
      actionButtonText: {
        ...Typography.button,
        fontSize: 14,
        color: Colors.white,
        paddingLeft: 7,
      }
    });