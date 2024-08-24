import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Alert, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { createOrder, createOrderList } from '../utils/api';

const MapScreen = ({navigation}) => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 22.5726,
    longitude: 88.3639,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);

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

    const getCurrentLocation = () => {
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
    };

    requestLocationPermission();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    console.log('coordinate', coordinate)
    if (!pickupLocation) {
      setPickupLocation(coordinate);
      reverseGeocode(coordinate, 'pickup');
    } else if (!dropLocation) {
      setDropLocation(coordinate);
      reverseGeocode(coordinate, 'drop');
    } else {
      Alert.alert('Error', 'Both pickup and drop-off locations are already set.');
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${address}&key=f8e0000bc14f4adea963fc17ba7ea82f`);
      if (response.data.results.length > 0) {
        return {
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        };
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get location from address');
      return null;
    }
  };

  const reverseGeocode = async (coordinate, type) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${coordinate.latitude},${coordinate.longitude}&key=f8e0000bc14f4adea963fc17ba7ea82f`);
      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted;
        if (type === 'pickup') {
          setPickupAddress(address);
        } else {
          setDropAddress(address);
        }
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get address from location');
    }
  };

  const handleSearch = async (type) => {
    const address = type === 'pickup' ? pickupAddress : dropAddress;
    const location = await geocodeAddress(address);

    if (location) {
      if (type === 'pickup') {
        setPickupLocation(location);
      } else {
        setDropLocation(location);
      }
    }
  };
  const handleConfirm = () => {
    if (pickupLocation && dropLocation) {
      const orderData = {
        id: Date.now().toString(),
        pickupLocation: pickupLocation,
        dropLocation: dropLocation,
        pickupAddress: pickupAddress,
        dropAddress: dropAddress,
      };
      createOrder(orderData);
      navigation.navigate('OrderConfirmed', {
        pickupLocation,
        dropLocation,
        pickupAddress,
        dropAddress
      });
    } else {
      Alert.alert('Error', 'Please set both pickup and drop-off locations.');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={currentLocation}
        onPress={handleMapPress} 
      >
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
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={pickupAddress}
          onChangeText={setPickupAddress}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSearch('pickup')}
        >
          <Text style={styles.buttonText}>Set Pickup Location</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Enter drop-off location"
          value={dropAddress}
          onChangeText={setDropAddress}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleSearch('drop')}
        >
          <Text style={styles.buttonText}>Set Drop-off Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
        >
          <Text style={styles.buttonText}>Confirm Locations</Text>
        </TouchableOpacity>
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
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MapScreen;
