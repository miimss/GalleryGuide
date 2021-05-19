import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, SafeAreaView } from 'react-native';
import firebaseApp, { firebaseAuth } from '../config/Firebase';

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSignUp = () => {
    firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        firebaseApp.database().ref('users').child(newUser.user.uid).set({
          username: username
        })
      })
      .then(() => {
        Alert.alert('User account created and signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-exists') {
          Alert.alert('Email already exists', 'Use a different email');
        }
        if (error.code === 'auth/invalid-email') {
          Alert.alert('Email is invalid');
        }
        if (error.code === 'auth/invalid-password') {
          Alert.alert('Password must be at least six characters long');
        }
        console.log(error);
      });
  }

  const checkPassword = () => {
    let check = password.localeCompare(password2);
    console.log(check);
    if (check === 0) {
      handleSignUp();
    } else {
      Alert.alert('Passwords do not match', 'Please check your passwords');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../assets/background.png')} style={styles.image}>

        <View style={styles.heading}>
          <Text style={styles.headerText}>Create a new account</Text>
        </View>

        <View style={styles.textInputView}>
          <View style={styles.inputBackground}>

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              secureTextEntry
              placeholder="Repeat password"
              value={password2}
              onChangeText={setPassword2}
            />
            <TouchableOpacity onPress={checkPassword}>
              <View style={styles.signUpBtn}>
                <Text style={styles.signUpBtnText}>SIGN UP</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.signIn}>
          <Text style={styles.signInText} onPress={() => navigation.navigate('SignInScreen')}>Already have an account? Sign in!</Text>
        </View>

      </ImageBackground>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  heading: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#330042'
  },
  input: {
    fontSize: 20,
    borderWidth: 1,
    width: 250,
    height: 40,
    marginBottom: 15,
    paddingLeft: 5,
    borderRadius: 5,
    backgroundColor: 'white'
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
  signIn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signInText: {
    fontSize: 20,
    color: "#330042",
    fontWeight: "bold"
  },
  signUpBtn: {
    backgroundColor: '#5215ed',
    borderRadius: 5
  },
  signUpBtnText: {
    color: 'white',
    padding: 10,
    fontSize: 20
  }
});
