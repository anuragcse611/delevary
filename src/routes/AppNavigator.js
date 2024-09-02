import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import React from 'react'
import Home from '../screens/Home'
import Splash from '../screens/Splash'
import LoginButtons from '../screens/LoginButtons'
import Login from '../screens/Login'
import DriverLogin from '../screens/DriverLogin'
import Register from '../screens/Register'
import HomeDriver from '../screens/HomeDriver'
import OrderConfirmed from '../screens/OrderConfirmed'
import Confirmation from '../screens/Confirmation'
import DriverMap from '../screens/DriverMap'
import DriverConfirmation from '../screens/DriverConfirmation'
import OrderHistory from '../screens/Driver/OrderHistory'
import OrderStatus from '../screens/Driver/OrderStatus'
import UserOrderStatus from '../screens/UserOrderStatus'
import UserHistory from '../screens/UserHistory'
import UserHomePage from '../screens/UserHomePage'

const Stack = createNativeStackNavigator();


// const HomeDriverDrawer = () => {
//   return (
//     <Drawer.Navigator initialRouteName="HomeDriver">
//       <Drawer.Screen name="HomeDriver" component={HomeDriver} />
//       <Drawer.Screen name="Order History" component={OrderHistory} />
//       <Drawer.Screen name="Order Status" component={OrderStatus} />
     
//     </Drawer.Navigator>
//   );
// };
const AppNavigator = () => {
  return (
    <Stack.Navigator  initialRouteName = 'Splash'  screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="LoginButtons" component={LoginButtons} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="DriverLogin" component={DriverLogin} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="HomeDriver" component={HomeDriver} />
    <Stack.Screen name="OrderConfirmed" component={OrderConfirmed} />
    <Stack.Screen name="Confirmation" component={Confirmation} />
    <Stack.Screen name="OrderHistory" component={OrderHistory} />
    <Stack.Screen name="OrderStatus" component={OrderStatus} />
    <Stack.Screen name="UserHistory" component={UserHistory} />
    <Stack.Screen name="UserOrderStatus" component={UserOrderStatus} />
    <Stack.Screen name="UserHomePage" component={UserHomePage} />
    
    
    <Stack.Screen name="DriverConfirmation" component={DriverConfirmation} />
   
  </Stack.Navigator>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})