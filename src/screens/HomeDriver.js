import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { getActiveOrders, acceptOrder, rejectOrder, logoutUser } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeDriver = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false); 

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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  
  const handleViewOrderHistory = (orderId) => {
    navigation.navigate('OrderHistory', { orderId }); 
  };
  const handleLogout = async () => {
    try {
      await logoutUser(); // Implement this function in your API
      await AsyncStorage.removeItem('userToken'); // Clear the user token
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginButtons' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <View style={styles.container}>
   
      <TouchableOpacity onPress={toggleSidebar} style={styles.sidebarToggle}>
        <Text style={styles.toggleText}>{showSidebar ? 'Close Menu' : 'Open Menu'}</Text>
      </TouchableOpacity>

      {showSidebar && (
        <View style={styles.sidebar}>
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.sidebarText}>Order History</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.sidebarItem} onPress={() => navigation.navigate('OrderStatus')}>
            <Text style={styles.sidebarText}>Order Status</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
            <Text style={styles.sidebarText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

     
      <Text style={styles.title}></Text>
      {orders.length === 0 ? (
        <Text style = {styles.titleCenter}>No new orders</Text>
      ) : (
        orders.map(order => (
          <View key={order.orderId} style={styles.orderCard}>
            <Text style={styles.orderDetails}>Pickup Address: {order.pickupAddress}</Text>
            <Text style={styles.orderDetails}>Drop Address: {order.dropAddress}</Text>
            <Text style={styles.orderDetails}>Distance: {order.distance}</Text>
            <Text style={styles.orderDetails}>Date & Time: {new Date(order.createdAt).toLocaleString()}</Text>
            <Button title="Accept" onPress={() => handleAcceptOrder(order.orderId)} />
            <Button title="Reject" onPress={() => handleRejectOrder(order.orderId)} color="red" />
            {/* Button to navigate to Order History */}
            <Button title="View Order History" onPress={() => handleViewOrderHistory(order.orderId)} />
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
  sidebarToggle: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sidebar: {
    position: 'absolute',
    top: 60,
    right: 0,
    width: 150,
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderColor: '#ddd',
    zIndex: 1, 
  },
  sidebarItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sidebarText: {
    fontSize: 16,
    color: '#000',
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 5,
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
  titleCenter:{
   
    justifyContent:"center",
    textAlign: "center"

  }
});

export default HomeDriver;
