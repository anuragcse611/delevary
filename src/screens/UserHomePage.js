import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from './Home';
import UserHistory from './UserHistory';
import UserProfile from './UserProfile';
import UserOrderStatus from './UserOrderStatus';


// Import images
const bannerTop = require("../assets/bannerTop.png");
const bannerBottom = require("../assets/bannerBottom.png");
const home = require("../assets/home.png");
const add = require("../assets/add.png");
const history = require("../assets/history.png");
const track = require("../assets/track.png");
const profile = require("../assets/profile.png");

const Tab = createBottomTabNavigator();

// Separate component for the home screen content
const HomeContent = ({ navigation }) => {
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      <Image source={bannerTop} style={styles.bannerTop} resizeMode="cover" />
      <Image source={bannerBottom} style={styles.bannerBottom} resizeMode="cover" />
      <Text style={styles.greeting}>{`${getWelcomeMessage()}, Anurag!`}</Text>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={() => navigation.navigate('New')}
      >
        <Text style={styles.buttonText}>Place Your Order</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main component with tab navigation
const UserHomePage = () => {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: false,
        
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'black',
        tabBarIcon: ({ color, size }) => {
          let iconSource;
          if (route.name === 'Home') iconSource = home;
          else if (route.name === 'Track') iconSource = track;
          else if (route.name === 'New') iconSource = add;
          else if (route.name === 'History') iconSource = history;
          else if (route.name === 'Profile') iconSource = profile;
          
          return <Image source={iconSource} style={{ height: 20, width: 20 }} resizeMode='contain' />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeContent} />
      <Tab.Screen name="Track" component={UserOrderStatus} />
      <Tab.Screen name="New" component={MapScreen} />
      <Tab.Screen name="History" component={UserHistory} />
      <Tab.Screen name="Profile" component={UserProfile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  bannerTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    width: '100%',
  },
  bannerBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    width: '100%',
  },
  greeting: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 2,
  },
  placeOrderButton: {
    position: 'absolute',
    top: "42%",
    backgroundColor: '#fffadd',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 2,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserHomePage;