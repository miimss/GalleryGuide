import { firebaseAuth } from '../config/Firebase';
import React from 'react';
import { Header } from 'react-native-elements';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HeaderComponent({ navigation }) {
  const currentUser = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;
  const handleLogout = () => {
    firebaseAuth.signOut()
      .then(() => navigation.navigate('SignInScreen'))
      .catch(error => console.log(error));
  }

  function SignInButton() {
    return (<TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>KIRJAUDU SISÄÄN</Text>
      </View>
    </TouchableOpacity>);
  }

  function SignOutButton() {
    return (<TouchableOpacity onPress={() => handleLogout()}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>LOGOUT</Text>
      </View>
    </TouchableOpacity>);
  }

  function HeaderButton() {
    if (currentUser) {
      return <SignOutButton />
    } else {
      return <SignInButton />
    }
  }

  function HeaderText() {
    return (
      <Text style={styles.headerText}>Gallery Guide</Text>
    )
  }

  return (
    <Header
      containerStyle={{ backgroundColor: '#5215ed' }}
      placement='left'
      leftComponent={<HeaderText />}
      rightComponent={<HeaderButton />}
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#5215ed',
    padding: 5
  },
  btnText: {
    color: '#fff',
    fontSize: 16
  },
  headerText: {
    color: '#fff',
    fontSize: 22
  }
});