import axios from 'axios';
import io from 'socket.io-client';

const API_URL = 'http://10.0.2.2:5000'; 
let socket = null; 


export const initializeSocket = () => {
  if (!socket) {
    socket = io(API_URL); 
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }
};


export const getSocket = () => {
  if (!socket) {
    console.error('Socket is not initialized. Make sure to call initializeSocket() before using socket.');
  }
  return socket;
};


export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Error in registerUser:', error);

    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server did not respond');
    }
  }
};


export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    console.error('Error in loginUser:', error);

    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server did not respond');
    }
  }
};



export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(`${API_URL}/create-order`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error.message);
    throw error;
  }
};


export const acceptOrder = async (orderId) => {
  try {
    const response = await axios.post(`${API_URL}/accept-order`, { orderId });
    return response.data;
  } catch (error) {
    console.error('Error accepting order:', error.response?.data || error.message);
    throw error;
  }
};


export const rejectOrder = async ({ orderId }) => {
  try {
    const response = await axios.post(`${API_URL}/reject-order`, { orderId });
    return response.data;
  } catch (error) {
    console.error('Error rejecting order:', error.response?.data || error.message);
    throw error;
  }
};


export const getActiveOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/active-orders`);
    console.log("Active orders response:", response.data);
    
   
    if (response.data && Array.isArray(response.data.activeOrders)) {
      return response.data.activeOrders; 
    } else {
      console.error('Unexpected response structure:', response.data);
      return []; 
    }
  } catch (error) {
    console.error('Error fetching active orders:', error.response?.data || error.message);
    throw error; 
  }
};
