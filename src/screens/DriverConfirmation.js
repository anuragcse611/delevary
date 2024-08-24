import Geolocation from '@react-native-community/geolocation'
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, PermissionsAndroid, Platform, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const DriverConfirmation = ({ route }) => {
  const { pickupLocation, pickupAddress, dropAddress, truck } = route.params;

  console.log('Pickup Location:', pickupLocation);
 

  
  if (!pickupLocation ) {
    return <Text>Error: Locations not available</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: pickupLocation.latitude,
          longitude: pickupLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker
          coordinate={{ latitude: pickupLocation.latitude, longitude: pickupLocation.longitude }}
          title="Pickup Location"
          description={pickupAddress}
          pinColor="blue"
        />
        
      </MapView>
      <View style={styles.infoContainer}>
       
        <Text>Pickup: {pickupAddress}</Text>
        <Text>Drop-off: {dropAddress}</Text>
        
        <Text>Price: ${truck.price.toFixed(2)}</Text>
      </View>
    </View>
  );
};


export default DriverConfirmation

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    elevation: 5, 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
})
