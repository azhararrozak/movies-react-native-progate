import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Favorite from '../screens/Favorite'
import MovieDetail from '../screens/MovieDetail'

const Stack = createNativeStackNavigator()

export default function FavoriteStackNavigation(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FavoritScreen"
        component={Favorite}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{
          headerTransparent: true,
          headerTitle: '',
        }}
      />
    </Stack.Navigator>
  )
}
