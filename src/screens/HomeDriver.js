import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { getActiveOrders, acceptOrder, rejectOrder } from '../utils/api'; 

const HomeDriver = ({navigation}) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const activeOrders = await getActiveOrders();
        setOrders(activeOrders);
      } catch (error) {
        console.error('Error fetching active orders:', error);
      }
    };

  
    fetchOrders();

  
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (orderId) => {
    console.log('orderId from driver', orderId, typeof orderId)
    try {
      const acceptedOrder = orders.find(order => order.orderId === orderId);
      if (!acceptedOrder) {
        Alert.alert('Error', 'Order not found');
        return;
      }

      await acceptOrder(orderId); 
      setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));

      Alert.alert('Success', 'Order accepted successfully');

     
      navigation.navigate('DriverConfirmation', {
        pickupLocation: acceptedOrder.pickupLocation,
    
        pickupAddress: acceptedOrder.pickupAddress,
        dropAddress: acceptedOrder.dropAddress,
        truck: acceptedOrder.truck,
         
      });
    } catch (error) {
      console.error('Error accepting order from driver:', error);
      Alert.alert('Error', 'Failed to accept the order');
    }
  };
  

  const handleRejectOrder = async (orderId) => {
    try {
      await rejectOrder({ orderId });
      setOrders(prevOrders => prevOrders.filter(order => order.orderId !== orderId));
      Alert.alert('Success', 'Order rejected successfully');
    } catch (error) {
      console.error('Error rejecting order:', error);
      Alert.alert('Error', 'Failed to reject the order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Home</Text>
      {orders.length === 0 ? (
        <Text>No new orders</Text>
      ) : (
        orders.map(order => (
          <View key={order.orderId} style={styles.orderCard}>
            <Text style={styles.orderDetails}>
              Pickup Address: {order.pickupAddress}
            </Text>
            <Text style={styles.orderDetails}>
              Drop Address: {order.dropAddress}
            </Text>
            <Text style={styles.orderDetails}>
              Distance: {order.distance} {/* Make sure this field exists in your data */}
            </Text>
            <Text style={styles.orderDetails}>
              Date & Time: {new Date(order.createdAt).toLocaleString()} {/* Format the date as needed */}
            </Text>
            <Button
              title="Accept"
              onPress={() => handleAcceptOrder(order.orderId)}
            />
            <Button
              title="Reject"
              onPress={() => handleRejectOrder(order.orderId)}
              color="red"
            />
          </View>
        ))
      )}
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
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderDetails: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default HomeDriver;
