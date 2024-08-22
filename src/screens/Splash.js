import { StyleSheet, Text, View, Image, StatusBar} from 'react-native'
import React, {useEffect} from 'react'
import splash from "../assets/splash.png"

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(()=>{
        navigation.replace('LoginButtons')
    },3000)
  
   
  }, [])
  
  return (

    <View style={{ alignItems: 'center', justifyContent: "center", flex: 1, backgroundColor: "lightyellow" }}>
      <StatusBar hidden/>
      <Image style={{ height: 100, width: 100, resizeMode: "contain"}} source={splash}
      />
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({})