import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { getOrderHistory } from '../../utils/api';

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await getOrderHistory();
        
        const sortedOrders = response.sort((a, b) => {
          const statusPriority = { accepted: 1, rejected: 2, pending: 3 };
          return statusPriority[a.status] - statusPriority[b.status];
        });
        setOrderHistory(sortedOrders);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setError('Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!orderHistory || orderHistory.length === 0) {
    return <Text>No order history available.</Text>;
  }

 
  const getCardBackgroundColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#d4edda'; // Green
      case 'rejected':
        return '#f8d7da'; // Red
      case 'pending':
        return '#d1ecf1'; // Blue
      default:
        return '#f9f9f9'; // Default 
    }
  };

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: getCardBackgroundColor(item.status) }]}>
      <Text>Order ID: {item.orderId}</Text>
      <Text>Pickup Address: {item.pickupAddress}</Text>
      <Text>Drop Address: {item.dropAddress}</Text>
      <Text>Distance: {item.distance}</Text>
      <Text>Date & Time: {new Date(item.createdAt).toLocaleString()}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <FlatList
        data={orderHistory}
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
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16
  },
  orderCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2
  }
});

export default OrderHistory;
