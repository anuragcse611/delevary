import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getAcceptedOrders } from '../utils/api';

const OrderStatus = () => {
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAcceptedOrders = async () => {
      try {
        const orders = await getAcceptedOrders();
        setAcceptedOrders(orders);
      } catch (error) {
        console.error('Error fetching accepted orders:', error);
        setError('Failed to fetch accepted orders');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>Error: {error}</Text>;
  }

  if (acceptedOrders.length === 0) {
    return <Text style={styles.noOrdersText}>No accepted orders at the moment.</Text>;
  }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
      <Text>Pickup: {item.pickupAddress}</Text>
      <Text>Drop-off: {item.dropAddress}</Text>
      <Text>Distance: {item.distance} km</Text>
      <Text>Created: {new Date(item.createdAt).toLocaleString()}</Text>
      
   
      <View style={styles.statusContainer}>
      <Text style={styles.title}>Status</Text>
        <Text style={styles.status}>
         
          <Text style={[styles.statusStep, item.status === 'accepted' && styles.activeStep]}>accepted</Text>
          <Text> -----▶ </Text>
          <Text style={[styles.statusStep, item.status === 'in Progress' && styles.activeStep]}>in Progress</Text>
          <Text> -----▶ </Text>
          <Text style={[styles.statusStep, item.status === 'completed' && styles.activeStep]}>completed</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accepted Orders</Text>
      <FlatList
        data={acceptedOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.orderId}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusContainer: {
    marginTop: 12,
  },
  status: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  statusStep: {
    fontWeight: 'bold',
    color: '#ccc',
  },
  activeStep: {
    color: '#007bff',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  noOrdersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default OrderStatus;
