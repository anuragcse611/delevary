const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http'); 
const socketIo = require('socket.io'); 
const session = require('express-session');
const MongoStore = require('connect-mongo');


//import AsyncStorage from '@react-native-async-storage/async-storage';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://10.0.0.2:8081', 
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: '@the@th@r!yhjhgxg',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://devsanuragpandey:u6cUx1a9MeriiFMP@cluster0.95mic.mongodb.net/myDatabase?retryWrites=true&w=majority',
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Middleware to check authentication
const authenticateSession = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://devsanuragpandey:u6cUx1a9MeriiFMP@cluster0.95mic.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error.message);
});

const server = http.createServer(app);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'driver'] },
});

const User = mongoose.model('User', userSchema);

const deliverySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: {
    longitude: Number,
    latitude: Number
  },
  deliveryLocation: {
    longitude: Number,
    latitude: Number
  },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  pickupAddress: String,
  dropAddress: String,
  orderId: String,
  truck: Object,
  distance: Number,
  createdAt: { type: Date, default: Date.now }
});

const Delivery = mongoose.model('Delivery', deliverySchema);



app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Error registering user' });
  }
});


app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user._id;
    res.json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logout successful' });
  });
});

app.post('/create-order', async (req, res) => {
  const orderData = req.body;
  const newOrder = new Delivery({
    ...orderData,
    orderId: Date.now().toString(),
    status: 'pending',
  });

  try {
    await newOrder.save();
    console.log('Order saved successfully:', newOrder);
    
   
    const drivers = await User.find({ role: 'driver' }); // Get all drivers
    drivers.forEach(driver => {
      
      console.log(`Notification sent to driver ${driver.email}: New order received`);
    });

    res.status(201).json({ message: 'Order saved successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

app.post('/accept-order', async (req, res) => {
  const { orderId } = req.body;
  console.log('orderId from backend', orderId, typeof orderId)

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
   
    const updatedOrder = await Delivery.findOneAndUpdate(
      { orderId: orderId },  
      { status: 'accepted' },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept order' });
  }
});


app.post('/reject-order', async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Delivery.findOneAndUpdate(
      { orderId },
      { status: 'rejected' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
 

    res.status(200).json({ message: 'Order rejected', order });
  } catch (error) {
    console.error('Error rejecting order:', error);
    res.status(500).json({ message: 'Failed to reject order', error: error.message });
  }
});

app.get('/active-orders', async (req, res) => {
  try {
    const activeOrders = await Delivery.find({ status: 'pending' });
    res.status(200).json({ activeOrders });
  } catch (error) {
    console.error('Error fetching active orders:', error);
    res.status(500).json({ message: 'Failed to fetch active orders', error: error.message });
  }
});

app.get('/order-history', async (req, res) => {
  try {
    // Fetch all orders from the database
    const orderHistory = await Delivery.find().sort({ createdAt: -1 });

    if (!orderHistory || orderHistory.length === 0) {
      return res.status(404).json({ error: 'No order history found' });
    }

    res.json(orderHistory);
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

app.get('/accepted-orders', async (req, res) => {
  try {
    const acceptedOrders = await Delivery.find({ status: 'accepted' }).sort({ createdAt: -1 });

    if (!acceptedOrders || acceptedOrders.length === 0) {
      return res.status(404).json({ error: 'No accepted orders found' });
    }

    res.json(acceptedOrders);
  } catch (error) {
    console.error('Error fetching accepted orders:', error);
    res.status(500).json({ error: 'Failed to fetch accepted orders' });
  }
});
  
app.get('/profile', authenticateSession, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

app.post('/change-password', authenticateSession, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.session.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
