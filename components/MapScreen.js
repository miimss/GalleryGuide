import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import HeaderComponent from './HeaderComponent';
import * as Location from 'expo-location';
import { useIsFocused } from "@react-navigation/native";

export default function MapScreen() {
  const isFocused = useIsFocused();
  const [places, setPlaces] = useState([]);
  const [region, setRegion] = useState({
    latitude: 60.171694,
    longitude: 24.936337,
    latitudeDelta: 0.00455,
    longitudeDelta: 0.00455
  });

  useEffect(() => {
    getPlaces();
  }, []);

  useEffect(() => {
    findLocation();
  }, [isFocused]);

  // Find user's current location and set it to the map
  const findLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === 'granted') {
      await Location.getCurrentPositionAsync({})
        .then(location => {
          setRegion({ ...region, latitude: location.coords.latitude, longitude: location.coords.longitude });
        });
    } else {
      Alert.alert('Permission to access location was denied');
    }
  }

  // Fetch all museums and galleries from myhelsinki API
  const getPlaces = () => {
    fetch(`http://open-api.myhelsinki.fi/v1/places/?tags_search=MUSEUMS%20%26%20GALLERIES`)
      .then(response => response.json())
      .then(data => {
        setPlaces(data.data);
      })
      .catch((error) => {
        Alert.alert('Error', error);
      });
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <View style={styles.map}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChange={() => setRegion(region)}
          showsUserLocation
          showsMyLocationButton={true}
          followsUserLocation={true}
        >
          {places.map((place, index) => (
            <View key={index}>
              <Marker
                coordinate={{ latitude: place.location.lat, longitude: place.location.lon }}
                title={place.name.fi}
                description={place.location.address.street_address}
                pinColor='#6600ff'
                onLongPress={() => navigation.navigate('PlaceScreen', place)}
              />
            </View>
          ))}
        </MapView>
        <StatusBar style="auto" />
      </View>
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
  map: {
    height: '95%',
    width: '100%',
  },
});