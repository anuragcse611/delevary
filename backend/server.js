const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://devsanuragpandey:u6cUx1a9MeriiFMP@cluster0.95mic.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('Error connecting to MongoDB Atlas:', error.message);
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true }, // Added unique constraint
  password: String,
  role: { type: String, enum: ['user', 'driver'] },
});

const User = mongoose.model('User', userSchema);

const deliverySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  pickupLocation: String,
  deliveryLocation: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
});
const Delivery = mongoose.model('Delivery', deliverySchema);





app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
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
      console.error('User not found'); // Log error message
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Invalid credentials'); // Log error message
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, '@the@th@r!yhjhgxg', { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error('Error logging in:', error.message); // Log error message
    res.status(500).json({ error: 'Error logging in' });
  }
});

app.post('/create-order', (req, res) => {
  const { pickupLocation, dropLocation, truckType, price } = req.body;

  
  // await saveOrderToDatabase(pickupLocation, dropLocation, truckType, price);


  io.emit('new-order', { pickupLocation, dropLocation, truckType, price });

  res.status(200).send({ message: 'Order created and sent to the driver.' });
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
