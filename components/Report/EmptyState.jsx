import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const EmptyState = ({ message = "No reports available" }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="search-off" size={80} color={Colors.primary} />
      <Text style={styles.title}>No Reports Found</Text>
      <Text style={styles.message}>{message}</Text>
      {message.includes("filters") && (
        <Text style={styles.suggestion}>
          Try changing your filters to see more results
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  suggestion: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  }
});

export default EmptyState;