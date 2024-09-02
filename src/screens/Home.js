import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { createOrder } from '../utils/api';
import MapViewDirections from 'react-native-maps-directions';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const MapScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 22.5726,
    longitude: 88.3639,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const pickupRef = useRef(null);
  const dropRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        }
      } else {
        getCurrentLocation();
      }
    };

    requestLocationPermission();
  }, []);

  const getCurrentLocation = useCallback(() => {
    Geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }, (error) => {
      Alert.alert('Error', error.message);
    });
  }, []);

  const reverseGeocode = useCallback(async (coordinate, type) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${coordinate.latitude},${coordinate.longitude}&key=f8e0000bc14f4adea963fc17ba7ea82f`);
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted;
        if (type === 'pickup' && pickupRef.current) {
          pickupRef.current.setAddressText(address);
        } else if (type === 'drop' && dropRef.current) {
          dropRef.current.setAddressText(address);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get address from location');
    }
  }, []);

  const handleMapPress = useCallback((event) => {
    const { coordinate } = event.nativeEvent;
    if (!pickupLocation) {
      setPickupLocation(coordinate);
      reverseGeocode(coordinate, 'pickup');
    } else if (!dropLocation) {
      setDropLocation(coordinate);
      reverseGeocode(coordinate, 'drop');
    } else {
      Alert.alert(
        'Update Location',
        'Which location do you want to update?',
        [
          {
            text: 'Pickup',
            onPress: () => {
              setPickupLocation(coordinate);
              reverseGeocode(coordinate, 'pickup');
            },
          },
          {
            text: 'Drop-off',
            onPress: () => {
              setDropLocation(coordinate);
              reverseGeocode(coordinate, 'drop');
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  }, [pickupLocation, dropLocation, reverseGeocode]);

  const handleConfirm = useCallback(() => {
    if (pickupLocation && dropLocation) {
      const orderData = {
        id: Date.now().toString(),
        pickupLocation: pickupLocation,
        dropLocation: dropLocation,
        pickupAddress: pickupRef.current?.getAddressText(),
        dropAddress: dropRef.current?.getAddressText(),
      };
      createOrder(orderData);
      navigation.navigate('OrderConfirmed', orderData);
    } else {
      Alert.alert('Error', 'Please set both pickup and drop-off locations.');
    }
  }, [pickupLocation, dropLocation, navigation]);

  const handleReset = useCallback(() => {
    setPickupLocation(null);
    setDropLocation(null);
    if (pickupRef.current) pickupRef.current.setAddressText('');
    if (dropRef.current) dropRef.current.setAddressText('');
  }, []);

  const handlePickupSelect = useCallback((data, details) => {
    console.log(details)
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
      setPickupLocation({ latitude: lat, longitude: lng });
    } else {
      Alert.alert('Error', 'Failed to get location details.');
    }
  }, []);
  
  const handleDropSelect = useCallback((data, details) => {
    if (details && details.geometry && details.geometry.location) {
      const { lat, lng } = details.geometry.location;
      setDropLocation({ latitude: lat, longitude: lng });
    } else {
      Alert.alert('Error', 'Failed to get location details.');
    }
  }, []);
  

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        onPress={handleMapPress}
      >
        {pickupLocation && dropLocation && (
          <MapViewDirections
            origin={pickupLocation}
            destination={dropLocation}
            strokeWidth={3}
            strokeColor="hotpink"
            apikey={"AIzaSyDnrr8nR7j2_juye271dg_K7VE9gi7NGtg"}
          />
        )}
        {pickupLocation && (
          <Marker
            coordinate={pickupLocation}
            title="Pickup Location"
            pinColor="blue"
          />
        )}
        {dropLocation && (
          <Marker
            coordinate={dropLocation}
            title="Drop-off Location"
            pinColor="red"
          />
        )}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.autocompleteContainer}>

          <GooglePlacesAutocomplete

            ref={pickupRef}
            placeholder='Enter pickup location'
            onPress={handlePickupSelect}
            fetchDetails={true}
            query={{
              key: 'AIzaSyDnrr8nR7j2_juye271dg_K7VE9gi7NGtg',
              language: 'en',
            }}
            styles={{
              container: styles.autocompleteInner,
              textInput: styles.autocompleteInput,
            }}
          />
        </View>

        <View style={styles.autocompleteContainer}>
          <GooglePlacesAutocomplete
            ref={dropRef}
            placeholder='Enter drop-off location'
            onPress={handleDropSelect}
            fetchDetails={true}
            query={{
              key: 'AIzaSyDnrr8nR7j2_juye271dg_K7VE9gi7NGtg',
              language: 'en',
            }}
            styles={{
              container: styles.autocompleteInner,
              textInput: styles.autocompleteInput,
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>Confirm Locations</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  autocompleteContainer: {
    marginBottom: 10,
  },
  autocompleteInner: {
    flex: 0,
  },
  autocompleteInput: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MapScreen;