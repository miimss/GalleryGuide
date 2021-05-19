import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TextInput, TouchableOpacity } from 'react-native';
import { firebaseAuth } from '../config/Firebase';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('BottomNavi'))
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Email address not found', 'Please check your email address');
        }
        if (error.code === 'auth/wrong-password') {
          Alert.alert('Wrong password', 'Please check your password');
        }
        console.log(error);
        console.log(error.code);
      });
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/background.png')} style={styles.image}>

        <View style={styles.header}>
          <Text style={styles.textHeader} >Gallery Guide</Text>
        </View>

        <View style={styles.textInputView}>
          <View style={styles.inputBackground}>

            <TextInput
              style={styles.textInput}
              placeholder='email'
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
            />

            <TextInput
              secureTextEntry
              style={styles.textInput}
              placeholder='password'
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={handleLogin}>
              <View style={styles.loginBtn}>
                <Text style={styles.loginBtnText}>LOGIN</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.text} onPress={() => navigation.navigate('ForgotPasswordScreen')}>Forgot your password?</Text>

          </View>
        </View>

        <View style={styles.links}>
          <View style={styles.signUp}>
            <Text style={styles.text} onPress={() => navigation.navigate('SignUpScreen')}>Don't have an account? Sign up!</Text>
          </View>
          <View style={styles.signUp}>
            <Text style={styles.text} onPress={() => navigation.navigate('BottomNavi')}>Continue without signing in</Text>
          </View>
        </View>

      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  textHeader: {
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#330042'
  },
  textInputView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBackground: {
    backgroundColor: '#f2f5f4',
    padding: 40,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7
  },
  textInput: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 2,
    width: 200,
    height: 40,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    fontSize: 18,
  },
  loginBtn: {
    backgroundColor: '#5215ed',
    borderRadius: 5,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBtnText: {
    color: 'white',
    padding: 10,
    fontSize: 20
  },
  text: {
    fontSize: 20,
    marginTop: 15,
    color: '#330042'
  },
  signUp: {
    marginBottom: 15
  },
  links: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
});