import { FlatList, StyleSheet, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { MovieListProps, Movie } from '../types/app'
import MovieItem from '../components/movies/MovieItem'

export default function CategorySearchResult({ route }: any): any {
  const API_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN
  const [moviesByCategory, setMoviesByCategory] = useState<Movie[]>([])
  const { id } = route.params;

  const coverImageSize = {
    backdrop: {
      width: 280,
      height: 160,
    },
    poster: {
      width: 100,
      height: 160,
    },
  }

  useEffect(() => {
    getMoviesByCategory()
  }, [])

  const getMoviesByCategory = (): void => {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${id}`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    }

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMoviesByCategory(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  return (
    <View>
      <FlatList
        data={moviesByCategory}
        renderItem={({ item }) => (
          <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  list: {
    padding: 10,
    alignItems: 'center',
    gap: 10,
  },
})