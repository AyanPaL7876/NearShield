import { View, StyleSheet } from 'react-native'
import React from 'react'
import Map from '../../components/Map';

const Explore = () => {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Explore;