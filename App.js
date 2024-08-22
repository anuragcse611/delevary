import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import React from 'react'
import AppNavigator from './src/routes/AppNavigator';

const App = () => {
  return (
    <NavigationContainer>
     <AppNavigator/>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})