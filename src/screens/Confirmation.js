import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import route hook
import socket from '../utils/api'; // Import socket from api.js

const Confirmation = ({ navigation }) => {
  const route = useRoute();
  const { truck, orderId } = route.params; // Get selected truck details from route params

  const handleTrackShipment = () => {
    // Navigate to the Driver's map screen with the pickup and drop locations
    navigation.navigate('', { orderId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Thank you for your order!</Text>
      <Text style={styles.details}>You have selected the {truck.type}</Text>
      <Text style={styles.details}>Price: ${truck.price}</Text>
      <Text>Your Order ID: {orderId}</Text>
      <TouchableOpacity style={styles.trackButton} onPress={handleTrackShipment}>
        <Text style={styles.trackButtonText}>Track Your Shipment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    fontSize: 18,
    marginBottom: 10,
  },
  trackButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default Confirmation;