import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import HeaderComponent from './HeaderComponent';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useIsFocused } from "@react-navigation/native";


export default function ListScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [places, setPlaces] = useState([]);
  const [listed, setListed] = useState([]);
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [currentPosition, setCurrentPosition] = useState({});
  const [selectedDistance, setSelectedDistance] = useState('');

  useEffect(() => {
    getPlaces();
    getCities();
    findLocation();
  }, [isFocused]);

  // Fetch all museums and galleries from myhelsinki API
  const getPlaces = () => {
    fetch(`http://open-api.myhelsinki.fi/v1/places/?tags_search=MUSEUMS%20%26%20GALLERIES`)
      .then(response => response.json())
      .then(data => {
        setPlaces(data.data);
        setListed(data.data);
      })
      .catch((error) => {
        Alert.alert('Error', error);
      });
  }
  // Set all cities that have museums or galleries to a list for the picker
  const getCities = () => {
    let foundCities = places.reduce((newArray, f) => {
      newArray.push(f.location.address.locality);
      return newArray;
    }, []);

    let filtederCities = foundCities.filter(onlyUnique).sort();

    setAllCities(filtederCities);
  }

  // Get unique values
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  // Get user's current location
  const findLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      return await Location.getCurrentPositionAsync({})
        .then(location => {
          setCurrentPosition({ latitude: location.coords.latitude, longitude: location.coords.longitude });
          return { latitude: location.coords.latitude, longitude: location.coords.longitude };
        });
    } else {
      Alert.alert("Permission needed", "You need to allow the app to use your location");
    }
  }

  // Calculate the distance between user and selected place
  const calculateDistance = (place, location) => {
    return getDistance(location, {
      latitude: place.location.lat,
      longitude: place.location.lon
    });
  }


  const filterByPostalCode = () => {
    const found = places.filter(p => p.location.address.postal_code === postalCode);
    if (found) {
      setListed(found);
    } else {
      Alert.alert('We found 0 places', 'Try another postal code');
    }
    setPostalCode('');
  }

  const filterByCity = () => {
    if (city === "ALL") {
      setListed(places);
    } else if (city === "SELECT") {
      Alert.alert("Select a city from the list");
    } else {
      const found = places.filter(p => p.location.address.locality === city);
      setListed(found);
    }
    setCity('');
  }

  const filterByDistance = async () => {
    if (selectedDistance === "SELECT") {
      Alert.alert("Select a distance from the list");
    } else {
      let location = await findLocation();

      const filtered = places.filter(d => calculateDistance(d, location) < selectedDistance);

      if (filtered.length === 0) {
        Alert.alert("No places found within the distance");
      }

      setListed(filtered);
      setSelectedDistance('');
    }
  }

  // Select random place from the list of all museums and galleries
  const selectRandom = () => {
    let count = places.length;
    let selected = Math.floor(Math.random() * count);

    let show = [];
    show.push(places[selected]);

    setListed(show);
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <View style={styles.header}>
        <Text style={styles.headerText}>Museums and galleries</Text>
      </View>

      <View style={styles.filters}>

        <View style={styles.input}>
          <View>
            <Text style={styles.filterText}>Filter by postal code</Text>
          </View>
          <View style={styles.picker}>
            <TextInput
              placeholder="Postal code"
              keyboardType="numeric"
              style={styles.filterText}
              value={postalCode}
              onChangeText={postalCode => setPostalCode(postalCode)}
            />
            <TouchableOpacity onPress={filterByPostalCode}>
              <View style={styles.filterBtn}>
                <Icon type='ionicon' name='search-outline' color='white' />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.input}>
          <View>
            <Text style={styles.filterText}>Filter by city</Text>
          </View>
          <View style={styles.picker}>
            <Picker
              style={{ width: 160, borderWidth: 1 }}
              selectedValue={city}
              onValueChange={(itemValue, itemIndex) =>
                setCity(itemValue)
              }
            >
              <Picker.Item
                label="---SELECT---"
                value="SELECT"
                style={{ fontSize: 20 }}
              />
              <Picker.Item
                label="Show all cities"
                value="ALL"
                style={{ fontSize: 20 }}
              />
              {
                allCities.map((item, i) => {
                  return (
                    <Picker.Item
                      key={i}
                      label={item}
                      value={item}
                      style={{ fontSize: 20 }}
                    />
                  )
                })
              }
            </Picker>
            <TouchableOpacity onPress={filterByCity}>
              <View style={styles.filterBtn}>
                <Icon type='ionicon' name='search-outline' color='white' />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.input}>
          <View>
            <Text style={styles.filterText}>Filter by distance</Text>
          </View>
          <View style={styles.picker}>
            <Picker
              style={{ width: 160, borderWidth: 1 }}
              selectedValue={selectedDistance}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedDistance(itemValue)
              }
            >
              <Picker.Item
                label="---SELECT---"
                value="SELECT"
                style={{ fontSize: 20 }}
              />
              <Picker.Item
                label="1 km"
                value="1000"
                style={{ fontSize: 20 }}
              />
              <Picker.Item
                label="3 km"
                value="3000"
                style={{ fontSize: 20 }}
              />
              <Picker.Item
                label="5 km"
                value="5000"
                style={{ fontSize: 20 }}
              />
              <Picker.Item
                label="10 km"
                value="10000"
                style={{ fontSize: 20 }}
              />
            </Picker>
            <TouchableOpacity onPress={filterByDistance}>
              <View style={styles.filterBtn}>
                <Icon type='ionicon' name='search-outline' color='white' />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.input}>
          <Text style={styles.filterText}>{listed.length} result(s)</Text>
          <TouchableOpacity onPress={selectRandom}>
            <View style={styles.filterBtn}>
              <Text style={styles.filterBtnText}>SELECT RANDOM</Text>
            </View>
          </TouchableOpacity>
        </View>

      </View>

      <View style={styles.list}>
        {listed &&
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) =>
              <View style={styles.listcontainer}>
                <View style={styles.textPosition}>
                  <Text style={styles.listHeader}>{item.name.fi || item.name.en}</Text>
                  <Text style={styles.listText}>{item.location.address.street_address}</Text>
                  <Text style={styles.listText}>{item.location.address.postal_code} {item.location.address.locality}</Text>
                  <Text>{calculateDistance(item, currentPosition)} meters away</Text>
                </View>
                <View style={styles.btnPosition}>
                  <TouchableOpacity onPress={() => navigation.navigate('PlaceScreen', item)}>
                    <View style={styles.btn}>
                      <Icon type='font-awesome-5' name='chevron-right' color='white' />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>}
            data={listed}
          />}
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#330042'
  },
  filters: {
    flex: 3,
    margin: 10
  },
  filterText: {
    fontSize: 18,
    marginRight: 15,
  },
  filterBtn: {
    backgroundColor: '#5215ed',
    padding: 6,
    borderRadius: 10,
    marginLeft: 15,
    marginBottom: 5
  },
  filterBtnText: {
    fontSize: 18,
    color: 'white'
  },
  input: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'flex-end',

  },
  list: {
    flex: 6,
    marginTop: 5
  },
  listcontainer: {
    flexDirection: 'row',
    width: 350,
    borderWidth: 2,
    marginBottom: 10,
    padding: 5,
    borderRadius: 5,
    borderColor: '#330042'
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#330042'
  },
  listText: {
    fontSize: 18,
    color: 'black'
  },
  textPosition: {
    width: '85%'
  },
  btnPosition: {
    flexDirection: 'row',
    alignItems: 'center'

  },
  btn: {
    backgroundColor: '#5215ed',
    padding: 15,
    borderRadius: 15,
  }
});