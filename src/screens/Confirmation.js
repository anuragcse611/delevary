import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getActiveOrders, createOrder } from '../utils/api'; 

const Confirmation = ({ navigation }) => {
  const route = useRoute();
  const { orderData } = route.params;
  const [orderAccepted, setOrderAccepted] = useState(false);

  useEffect(() => {
    const checkOrderStatus = async () => {
      try {
        const response = await getActiveOrders(orderData.orderId);
        if (response && response.order && response.order.status === 'accepted') {
          setOrderAccepted(true);
        }
      } catch (error) {
        console.error('Error fetching order status:', error);
        Alert.alert('Error', 'Failed to fetch order status.');
      }
    };

   
    const intervalId = setInterval(() => {
      checkOrderStatus();
    }, 5000); 

    return () => clearInterval(intervalId); 
  }, [orderData.orderId]);

  const handleTrackShipment = () => {
    navigation.navigate('TrackShipment', { orderId: orderData.orderId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Thank you for your order!</Text>
      <Text style={styles.details}>You have selected the {orderData.truck.type}</Text>
      <Text style={styles.details}>Price: ${orderData.truck.price.toFixed(2)}</Text>
      <Text style={styles.details}>Your Order ID: {orderData.orderId}</Text>
      <Text style={styles.details}>Pickup: {orderData.pickupAddress}</Text>
      <Text style={styles.details}>Drop-off: {orderData.dropAddress}</Text>
      <Text style={styles.details}>Distance: {orderData.distance.toFixed(2)} km</Text>

      {orderAccepted ? (
        <TouchableOpacity style={styles.trackButton} onPress={handleTrackShipment}>
          <Text style={styles.trackButtonText}>Track Shipment</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.waitingText}>Waiting for a driver to accept your order...</Text>
      )}
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
  waitingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default Confirmation;
