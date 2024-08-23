import axios from 'axios';
import io, { Socket } from 'socket.io-client';

const API_URL = 'http://10.0.2.2:5000'; 

const socket = io(API_URL, {
  transports: ['websocket'], 
  jsonp: false
});

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // Log the full error object for debugging
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

export const createOrder = async (pickupLocation, dropLocation, truckType, price) => {
  try {
    const response = await axios.post(`${API_URL}/create-order`, {
      pickupLocation,
      dropLocation,
      truckType,
      price,
    });
    console.log(response.data.message);
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

export const acceptOrder = (orderId) => {
  socket.emit('accept-order', orderId);
};

export default socket;