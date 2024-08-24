import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import React,{useEffect} from 'react'
import AppNavigator from './src/routes/AppNavigator';
import { initializeSocket } from './src/utils/api';

const App = () => {
  useEffect(() => {
    initializeSocket(); 
  }, []);
  return (
    <NavigationContainer>
     <AppNavigator/>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})