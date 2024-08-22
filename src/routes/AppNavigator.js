import { StyleSheet, Text, View } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import Home from '../screens/Home'
import Splash from '../screens/Splash'
import LoginButtons from '../screens/LoginButtons'
import Login from '../screens/Login'
import DriverLogin from '../screens/DriverLogin'
import Register from '../screens/Register'

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
  return (
    <Stack.Navigator  initialRouteName = 'Splash'  screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={Home} />
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="LoginButtons" component={LoginButtons} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="DriverLogin" component={DriverLogin} />
    <Stack.Screen name="Register" component={Register} />
   
  </Stack.Navigator>
  )
}

export default AppNavigator

const styles = StyleSheet.create({})