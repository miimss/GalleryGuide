import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from './components/FavoritesScreen';
import MapScreen from './components/MapScreen';
import SignInScreen from './components/SignInScreen';
import ListScreen from './components/ListScreen';
import SignUpScreen from './components/SignUpScreen';
import LoadingScreen from './components/LoadingScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import PlaceScreen from './components/PlaceScreen';
const Tab = createBottomTabNavigator();

function BottomNavi() {

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      let iconName;

      if (route.name === 'FavoritesScreen') {
        iconName = 'star';
      } else if (route.name === 'MapScreen') {
        iconName = 'earth-outline';
      } else if (route.name === 'ListScreen') {
        iconName = 'list';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    }
  });

  return (
    <Tab.Navigator
      screenOptions={screenOptions}
      tabBarOptions={{
        style: { backgroundColor: '#5215ed' },
        activeTintColor: 'white',
        inactiveTintColor: 'white',
        activeBackgroundColor: '#3f00de',
        showLabel: false
      }}>
      <Tab.Screen name='MapScreen' component={MapScreen} />
      <Tab.Screen name='FavoritesScreen' component={FavoritesScreen} />
      <Tab.Screen name='ListScreen' component={ListScreen} />
    </Tab.Navigator>
  );
}

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="LoadingScreen" component={LoadingScreen} />
        <Stack.Screen options={{ headerShown: false }} name="SignInScreen" component={SignInScreen} />
        <Stack.Screen options={{ headerShown: false }} name="BottomNavi" component={BottomNavi} />
        <Stack.Screen options={{ headerShown: false }} name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen options={{ headerShown: false }} name="PlaceScreen" component={PlaceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


