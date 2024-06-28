import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Search from '../screens/Search'
import CategorySearchResult from '../screens/CategorySearchResult'
import MovieDetail from '../screens/MovieDetail'

const Stack = createNativeStackNavigator()

export default function SearchStackNavigation(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SearchMovies"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategorySearchResult"
        component={CategorySearchResult}
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
