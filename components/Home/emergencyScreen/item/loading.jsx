import React from 'react';
import { 
  View, 
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { Colors, Shadow, Typography } from '@/constants';

const Loading = ({item}) => {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#4A80F0" />
      <Text style={styles.loadingText}>Finding nearby {item}...</Text>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 32,
      backgroundColor: Colors.background,
    },
    loadingText: {
      ...Typography.subtitle,
      marginTop: 20,
      color: Colors.textSecondary,
    }
  });

