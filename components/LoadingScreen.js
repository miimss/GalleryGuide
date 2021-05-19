import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ActivityIndicator } from 'react-native';
import { firebaseAuth } from '../config/Firebase';

export default function Loading({ navigation }) {

  // Check if user is logged in
  useEffect(() => {
    firebaseAuth.onAuthStateChanged(user => {
      navigation.navigate(user ? 'BottomNavi' : 'SignInScreen')
    })
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background.png')} style={styles.background}>

        <View style={styles.header}>
          <Text style={styles.headerText}>Loading...</Text>
          <ActivityIndicator size="large" />
        </View>

      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center'
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#330042'
  }

});