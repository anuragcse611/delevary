import Geolocation from '@react-native-community/geolocation'
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, PermissionsAndroid, Platform, Text } from 'react-native'
import MapView, { Marker } from 'react-native-maps'

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation()
        }
      } else {
        getCurrentLocation()
      }
    }

    const getCurrentLocation = () => {
     try {
      Geolocation.getCurrentPosition((position)=>{

        setCurrentLocation({
          latitude:position?.coords?.latitude,
          longitude:position.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        })
      });
    
     console.log('location', location)

  
      
     } catch (error) {
      
     }
    }

    requestLocationPermission()
  }, [])

  return (
    <View style={styles.container}>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={currentLocation ?? {
            latitude: 22.5726,
            longitude: 88.3639,
         
          }}  // Set the initial region to the current location
        >
          {/* Marker for Current Location */}
          <Marker
            coordinate={{
              latitude: currentLocation?.latitude ? currentLocation?.latitude : 22.5726 ,
              longitude: currentLocation?.longitude ? currentLocation?.longitude : 88.3639,
            }}
            title="You are here"
            pinColor="blue"
          />
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text>Loading your location...</Text>
        </View>
      )}
    </View>
  )
}

export default MapScreen

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
})
