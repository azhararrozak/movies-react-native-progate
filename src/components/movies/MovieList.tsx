import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native'
import type { MovieListProps, Movie } from '../../types/app'
import MovieItem from './MovieItem'
import { useFonts, Inter_700Bold } from '@expo-google-fonts/inter';

const MovieList = ({ title, path, coverType }: MovieListProps): JSX.Element => {
    const API_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN
  const [movies, setMovies] = useState<Movie[]>([])
  
  const [fontsLoaded, fontError] = useFonts({
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      getMovieList();
    }
  }, [fontsLoaded]);

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

  const getMovieList = (): void => {
    const url = `https://api.themoviedb.org/3/${path}`
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
        setMovies(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <FlatList
        style={{
          ...styles.movieList,
          maxHeight: coverImageSize[coverType].height,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={movies}
        renderItem={({ item }) => (
          <MovieItem
            movie={item}
            size={coverImageSize[coverType]}
            coverType={coverType}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginLeft: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginVertical: 8,
    fontFamily: 'Inter_700Bold',
  },
  movieList: {
    paddingLeft: 4,
    marginTop: 8,
  },
})

export default MovieList