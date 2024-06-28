import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeStackNavigation from './HomeStackNavigation';
import SearchStackNavigation from './SearchStackNavigation';
import FavoriteStackNavigation from './FavoriteStackNavigation';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = (): JSX.Element => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Search') {
          iconName = 'search';
        } else if (route.name === 'Favorite') {
          iconName = 'heart';
        }

        return <Feather name={iconName} size={28} color={color} />;
      },
      headerShown: false,
      tabBarStyle: {
        height: 70, 
        backgroundColor: '#1C1221',
        paddingVertical: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
      },
      tabBarItemStyle: {
        paddingVertical: 5, 
      },
      tabBarActiveTintColor: '#fff',
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackNavigation}
    />
    <Tab.Screen
      name="Search"
      component={SearchStackNavigation}
    />
    <Tab.Screen
      name="Favorite"
      component={FavoriteStackNavigation}
    />
  </Tab.Navigator>
);

export default BottomTabNavigator;
