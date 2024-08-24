import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import truckImage from '../assets/splash.png';
import { createOrder } from '../utils/api'; 

const OrderConfirmed = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pickupLocation, dropLocation, pickupAddress, dropAddress } = route.params;

  const [distance, setDistance] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  useEffect(() => {
    
    const calculatedDistance = calculateDistance(pickupLocation, dropLocation);
    setDistance(calculatedDistance);

    
    setBasePrice(calculatedDistance * 2); 
  }, [pickupLocation, dropLocation]);

  const trucks = [
    { type: 'Small Truck', priceMultiplier: 1, image: truckImage },
    { type: 'Medium Truck', priceMultiplier: 1.5, image: truckImage },
    { type: 'Large Truck', priceMultiplier: 2, image: truckImage },
    { type: 'Extra Large Truck', priceMultiplier: 2.5, image: truckImage },
  ];

  const handleTruckSelection = async (truck) => {
    const finalPrice = basePrice * truck.priceMultiplier;
    const orderData = {
      pickupLocation,
      dropLocation,
      pickupAddress,
      dropAddress,
      distance,
      truck: { 
        type: truck.type,
        price: finalPrice
      },
      orderId: "UBIRE" + (Math.random() * 12371826).toFixed().padEnd(8, '0')
    };

    try {
      const response = await createOrder(orderData);
      if (response && response.order) {
        navigation.navigate('Confirmation', { orderData: response.order });
      } else {
        Alert.alert('Error', 'Failed to create the order. Please try again.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };


  const calculateDistance = (start, end) => {
    const latDiff = Math.abs(start.latitude - end.latitude);
    const lonDiff = Math.abs(start.longitude - end.longitude);
    return Math.sqrt(latDiff * latDiff + lonDiff * lonDiff) * 111; 
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose your Vehicle</Text>
      <Text style={styles.details}>Pickup: {pickupAddress}</Text>
      <Text style={styles.details}>Drop-off: {dropAddress}</Text>
      <Text style={styles.details}>Total Distance: {distance.toFixed(2)} km</Text>
      <Text style={styles.details}>Base Price: ${basePrice.toFixed(2)}</Text>

      <View style={styles.truckContainer}>
        {trucks.map((truck, index) => (
          <TouchableOpacity
            key={index}
            style={styles.truckCard}
            onPress={() => handleTruckSelection(truck)}
          >
            <Image source={truck.image} style={styles.truckImage} />
            <Text style={styles.truckType}>{truck.type}</Text>
            <Text style={styles.truckPrice}>
              ${(basePrice * truck.priceMultiplier).toFixed(2)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  details: {
    fontSize: 16,
    marginBottom: 10,
  },
  truckContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  truckCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  truckImage: {
    width: 100,
    height: 60,
    resizeMode: 'contain',
  },
  truckType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  truckPrice: {
    fontSize: 16,
    color: '#007BFF',
  },
});

export default OrderConfirmed;
