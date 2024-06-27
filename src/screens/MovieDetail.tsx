import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { View, Text, ImageBackground, FlatList, StyleSheet } from 'react-native'
import MovieItem from '../components/movies/MovieItem'

const MovieDetail = ({ route }: any): any => {
  // const fetchData = (): void => {
  //   // Gantilah dengan akses token Anda
  //   // const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NzY5ODFiNDM5ODhhODE1ZmJlNGMzOWZmNTE2ZjliYSIsIm5iZiI6MTcxOTQ0Nzk4OC42NDg4MzYsInN1YiI6IjY0NDhjMDMzMGYyMWM2MDRjMjI4MDZkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.6lAZ4_dLj99lw_LtTX8k7nyts0C3wKCyX5CXGWnauDc"

  //   // const url = "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1"


  //   const ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN
  //   const URL = process.env.EXPO_PUBLIC_API_URL

  //   const options = {
  //     method: 'GET',
  //     headers: {
  //       accept: 'application/json',
  //       Authorization: `Bearer ${ACCESS_TOKEN}`,
  //     },
  //   }

  //   fetch(URL, options)
  //     .then(async (response) => await response.json())
  //     .then((response) => {
  //       console.log(response)
  //     })
  //     .catch((err) => {
  //       console.error(err)
  //     })
  // }

  const [movie, setMovie] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const coverType = 'poster'
  const API_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN

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
    getMoviesById()
    getRecomendations()
  }, [])

  const getMoviesById = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`
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
        setMovie(response)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const getRecomendations = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations`
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
        setRecommendations(response.results)
      })
      .catch((errorResponse) => {
        console.log(errorResponse)
      })
  }

  const { id } = route.params

  return (
    <View
      style={{
        display: 'flex',
        padding: 8
      }}
    >
      {/* <Text>Movie Detail: {id}</Text> */}
      <ImageBackground
        resizeMode="cover"
        style={ styles.backgroundImage}
        // imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${
            movie.backdrop_path
          }`,
        }}
      >
        <Text style={ styles.movieTitle }>{movie.original_title}</Text>
        <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{movie.vote_average}</Text>
          </View>
      </ImageBackground>
     

      <Text>{movie.overview}</Text>

      <View style={styles.header}>
        <View style={styles.purpleLabel}></View>
        <Text style={styles.title}>Recomendations</Text>
      </View>

      <FlatList
        style={{
          ...styles.movieList,
          maxHeight: coverImageSize[coverType].height,
        }}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={recommendations}
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
  backgroundImage: {
    width: 400,
    height:200,
    justifyContent: 'flex-end',
    padding: 8,
  },
  backgroundImageStyle: {
    borderRadius: 8,
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  gradientStyle: {
    padding: 8,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
  },
  header: {
    marginVertical: 16,
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
    fontWeight: '900',
  },
})

export default MovieDetail