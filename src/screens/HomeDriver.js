// DriverHome.js

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import socket, { acceptOrder } from '../utils/api';

const DriverHome = () => {
  const [newOrder, setNewOrder] = useState(null);

  useEffect(() => {
    socket.on('new-order', (order) => {
      setNewOrder(order);
    });

    return () => {
      socket.off('new-order');
    };
  }, []);

  const handleAcceptOrder = () => {
    acceptOrder(newOrder._id);
    setNewOrder(null); // Reset the order after acceptance
  };

  const handleRejectOrder = () => {
    setNewOrder(null); // Reset the order if rejected
  };

  return (
    <View style={styles.container}>
      {newOrder ? (
        <View style={styles.orderContainer}>
          <Text>New Order Available!</Text>
          <Text>Pickup: {newOrder.pickupLocation}</Text>
          <Text>Drop: {newOrder.dropLocation}</Text>
          <Text>Truck: {newOrder.truckType}</Text>
          <Text>Price: ${newOrder.price}</Text>
          <TouchableOpacity onPress={handleAcceptOrder}>
            <Text>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRejectOrder}>
            <Text>Reject</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>No new orders</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderContainer: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
});

export default DriverHome;
