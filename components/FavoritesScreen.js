import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, Alert } from 'react-native';
import HeaderComponent from './HeaderComponent';
import { ListItem, Icon } from 'react-native-elements';
import firebaseApp, { firebaseAuth } from '../config/Firebase';


export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const currentUser = firebaseAuth.currentUser ? firebaseAuth.currentUser : null;

  useEffect(() => {
    showFavorites();
  }, []);

  const showFavorites = async () => {
    getFavorites()
      .then(r => setFavorites(r))
      .catch(error => console.log(error));

    console.log(favorites);
  }

  // Fetch user's favorite places from database
  const getFavorites = async () => {
    let places = [];
    if (currentUser) {
      try {
        await firebaseApp.database()
          .ref(`/users/${currentUser.uid}/favorites`)
          .once('value', snapshot => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const p = Object.values(data);
              places = p;
            }
          });
      } catch (error) {
        console.log("Error finding favorites " + error)
      }
    }
    return places;
  }

  // Remove a place from user's favorites on the database
  const deleteFavorite = (item) => {
    try {
      firebaseApp.database().ref(`/users/${currentUser.uid}/favorites/${item.key}`).remove();

      Alert.alert(`${item.place.name.fi} removed from your favorites`)
    } catch (error) {
      console.log(error);
      Alert.alert('Something went wrong')
    }

    let newFavorites = favorites.filter(f => f.key !== item.key);
    setFavorites(newFavorites);
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <Text style={styles.headerText}>Favorites</Text>
      <ScrollView style={styles.list}>
        {
          favorites.map((item, i) => (
            <ListItem
              key={i}
              bottomDivider>
              <Icon type='ionicon' name='trash-outline' size={30} color={'#330042'} onPress={() => deleteFavorite(item)} />
              <ListItem.Content>
                <ListItem.Title style={styles.title}>{item.place.name.fi}</ListItem.Title>
                <ListItem.Subtitle style={styles.subtitle}>{item.place.location.address.street_address}</ListItem.Subtitle>
                <ListItem.Subtitle style={styles.subtitle}>{item.place.location.address.postal_code} {item.place.location.address.locality}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron size={30} color={'#330042'} onPress={() => navigation.navigate('PlaceScreen', item.place)} />
            </ListItem>
          ))
        }
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#330042',
    margin: 20
  },
  list: {
    width: '90%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#330042'
  },
  subtitle: {
    fontSize: 18
  }
});