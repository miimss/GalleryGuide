import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import firebaseApp, { firebaseAuth } from '../config/Firebase';
import HeaderComponent from './HeaderComponent';
import MapView, { Marker } from 'react-native-maps';

export default function PlaceScreen({ navigation, route }) {
  const place = route.params;
  const user = firebaseAuth.currentUser.uid ? firebaseAuth.currentUser.uid : null;
  const favoritesRef = `users/${user}/favorites/`;
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    isFavorite();
  }, []);

  // Get user's favorites from database
  const getFavorites = async () => {
    let places = [];
    if (user) {
      try {
        await firebaseApp.database()
          .ref(favoritesRef)
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

  // Put user's favorite places' id's to a list
  const getFavoriteIds = async () => {
    let found = await getFavorites();

    let ids = found.reduce((newArray, f) => {
      newArray.push(f.place.id);
      return newArray;
    }, []);
    console.log(ids);
    return ids;
  }

  // Compare if place is on user's favorites list
  const isFavorite = () => {
    getFavoriteIds().then(f => {
      console.log(place.id);
      let isInFavorites = f.includes(place.id);

      setDisabled(isInFavorites);
    });

  }

  const getKey = () => {
    return firebaseApp.database().ref(favoritesRef).push().getKey();
  }

  // Add a place to user's favorites list on the database
  const addToFavorites = async () => {
    try {
      let key = getKey();

      firebaseApp.database().ref(favoritesRef + key).set(
        {
          key: key,
          place
        }
      );

      Alert.alert("Added to favorites");

    } catch (error) {
      console.log("Error saving place " + error);
    }
  }

  // Render disabled button, if place already is on user's favorites list
  function DisabledButton() {
    if (disabled) {
      return (
        <TouchableOpacity onPress={() => addToFavorites()} disabled={disabled}>
          <View style={styles.favoriteBtnDisabled}>
            <Text style={styles.btnText}>Add to favorites</Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity onPress={() => addToFavorites()} disabled={disabled}>
          <View style={styles.favoriteBtn}>
            <Text style={styles.btnText}>Add to favorites</Text>
          </View>
        </TouchableOpacity>
      );
    }
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />

      <View style={styles.header}>
        <Text style={styles.headerText}>{place.name.fi || place.name.en}</Text>
      </View>

      <View style={styles.description}>
        <ScrollView>
          <Text style={styles.descriptionText}>{place.description.body}</Text>
          <Text style={styles.descriptionText}>{place.location.address.street_address} {place.location.address.postal_code} {place.location.address.locality}</Text>
          <Text
            style={styles.descriptionLink}
            onPress={() => Linking.openURL(place.info_url)}>
            {place.info_url}
          </Text>
          <View style={styles.map}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: place.location.lat,
                longitude: place.location.lon,
                latitudeDelta: 0.00322,
                longitudeDelta: 0.00181
              }}
            >
              <Marker
                coordinate={{ latitude: place.location.lat, longitude: place.location.lon }}
                title={place.name.fi}
                pinColor='#6600ff'
              />
            </MapView>
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttons}>

        {user && <DisabledButton />}

        <TouchableOpacity onPress={() => navigation.goBack()} >
          <View style={styles.backBtn}>
            <Text style={styles.btnText}>Close</Text>
          </View>
        </TouchableOpacity>
      </View>
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
    color: '#330042'
  },
  description: {
    flex: 6,
    margin: 15
  },
  descriptionText: {
    fontSize: 20,
    marginBottom: 15,
    color: '#330042'
  },
  descriptionLink: {
    fontSize: 20,
    marginBottom: 15,
    color: '#330042',
    textDecorationLine: 'underline'
  },
  map: {
    width: 400,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
  },
  backBtn: {
    backgroundColor: '#029B76',
    padding: 15,
    borderRadius: 50,
    marginHorizontal: 20
  },
  favoriteBtn: {
    backgroundColor: '#5215ed',
    padding: 15,
    borderRadius: 50
  },
  favoriteBtnDisabled: {
    backgroundColor: '#bbadc4',
    padding: 15,
    borderRadius: 50
  },
  btnText: {
    color: 'white',
    fontSize: 20
  }
});