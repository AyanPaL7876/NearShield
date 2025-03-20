import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  TouchableOpacity, 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { Colors, Typography, Shadow } from '@/constants';

const ErrorMsg = ({msg}) => {
  return (
    <View style={styles.centerContainer}>
      <FontAwesome name="exclamation-triangle" size={50} color="#FF6B6B" />
      <Text style={styles.errorText}>{msg}</Text>
      <TouchableOpacity style={styles.retryButton}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorMsg;


const styles = StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: Colors.background,
    },
    errorText: {
      ...Typography.subtitle,
      marginTop: 8,
      color: Colors.error,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: 24,
      paddingVertical: 14,
      paddingHorizontal: 32,
      backgroundColor: Colors.primary,
      borderRadius: 10,
      ...Shadow.small,
    },
    retryButtonText: {
      ...Typography.button,
      color: Colors.white,
      textAlign: 'center',
    }
  });