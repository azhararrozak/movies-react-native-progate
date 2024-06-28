import React, { useState, useEffect } from 'react'
import {
  Button,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useNavigation, StackActions } from '@react-navigation/native'

export default function CategorySearch(): JSX.Element {
  const [categories, setCategories] = useState<any[]>([])
  const [selectedButton, setSelectedButton] = useState<number | null>(null)
  const navigation = useNavigation()
  const pushAction = StackActions.push('CategorySearchResult', {
    id: selectedButton,
  })

  useEffect(() => {
    getCategories()
  }, [])

  const getCategories = (): void => {
    const url = 'https://api.themoviedb.org/3/genre/movie/list'
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setCategories(response.genres)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const handlePress = (id: number) => {
    setSelectedButton(id)
  }

  return (
    <View>
      <ScrollView contentContainerStyle={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.button,
              selectedButton === category.id && styles.selectedButton,
            ]}
            onPress={() => handlePress(category.id)}
          >
            <Text style={styles.buttonText}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          navigation.dispatch(pushAction)
        }}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  button: {
    width: '48%', // Ensure two buttons per row
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#7896eb',
    borderRadius: 15,
  },
  selectedButton: {
    backgroundColor: '#3700B3', // Change the color when selected
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  searchButton: {
    borderRadius: 15,
    backgroundColor: '#7896eb',
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
