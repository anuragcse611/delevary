// OrderConfirmed.js
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import truckImage from '../assets/splash.png'; 
const OrderConfirmed = () => {
  const navigation = useNavigation();

  const trucks = [
    { type: 'Small Truck', price: 50, image: truckImage },
    { type: 'Medium Truck', price: 100, image: truckImage },
    { type: 'Large Truck', price: 150, image: truckImage },
    { type: 'Extra Large Truck', price: 200, image: truckImage },
  ];

  const handleTruckSelection = (truck) => {
    navigation.navigate('Confirmation', { truck });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your Vehicle</Text>
      <Text style={styles.details}>Pickup Location: [Your Pickup Location]</Text>
      <Text style={styles.details}>Drop-off Location: [Your Drop-off Location]</Text>
      <Text style={styles.details}>Total Distance: [Static Distance]</Text>
      <Text style={styles.details}>Price: [Static Price]</Text>

      <View style={styles.truckContainer}>
        {trucks.map((truck, index) => (
          <TouchableOpacity
            key={index}
            style={styles.truckCard}
            onPress={() => handleTruckSelection(truck)}
          >
            <Image source={truck.image} style={styles.truckImage} />
            <Text style={styles.truckType}>{truck.type}</Text>
            <Text style={styles.truckPrice}>${truck.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
