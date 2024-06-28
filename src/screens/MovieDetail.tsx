import React, { useState, useEffect } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import {
  View,
  Text,
  ImageBackground,
  FlatList,
  StyleSheet,
  ScrollView,
} from 'react-native'
import MovieItem from '../components/movies/MovieItem'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LinearGradient } from 'expo-linear-gradient'
import { useFonts, Inter_600SemiBold } from '@expo-google-fonts/inter'

const MovieDetail = ({ route }: any): any => {
  const [movie, setMovie] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const coverType = 'poster'
  const API_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN
  const [fontsLoaded, fontError] = useFonts({
    Inter_600SemiBold,
  })
  const { id } = route.params

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
    if (fontsLoaded) {
      getMoviesById()
      getRecomendations()
      checkIfFavorite()
    }
  }, [fontsLoaded])

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

  const checkIfFavorite = async () => {
    try {
      const initialData = await AsyncStorage.getItem('@FavoriteList')
      if (initialData !== null) {
        const favMovieList = JSON.parse(initialData)
        const isFav = favMovieList.some((favMovie: any) => favMovie.id === id)
        setIsFavorite(isFav)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const toggleFavorite = async () => {
    try {
      const initialData = await AsyncStorage.getItem('@FavoriteList')
      let favMovieList = initialData !== null ? JSON.parse(initialData) : []

      if (isFavorite) {
        favMovieList = favMovieList.filter(
          (favMovie: any) => favMovie.id !== id,
        )
      } else {
        favMovieList.push(movie)
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.log(error)
    }
  }

  if (!fontsLoaded && !fontError) {
    return null
  }

  return (
    <ScrollView
      style={{
        display: 'flex',
        backgroundColor: '#1C1221',
      }}
    >
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.gradient}
        >
          <View>
            <Text style={styles.movieTitle}>{movie.original_title}</Text>
            <Text style={styles.movieDate}>{movie.release_date}</Text>
            <FlatList
              contentContainerStyle={styles.movieGenreList}
              data={movie.genres}
              horizontal
              renderItem={({ item }) => (
                <View style={styles.movieGenre}>
                  <Text style={styles.movieGenreItem}>{item.name}</Text>
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
            <View style={styles.bottomContainer}>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={25} color="yellow" />
                <Text style={styles.rating}>{movie.vote_average}</Text>
              </View>
              <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={25}
                color="red"
                onPress={toggleFavorite}
              />
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <Text style={styles.overviewText}>{movie.overview}</Text>
        
          {/* <FlatList 
            data={movie.production_countries}
            renderItem={({ item }) => (
              <Text>{getUnicodeFlagIcon(item.iso_3166_1)}</Text>
            )}
            keyExtractor={(item) => item.iso_3166_1}
          /> */}
          
        <View style={styles.header}>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 500,
    justifyContent: 'flex-end',
  },
  backgroundImageStyle: {
    resizeMode: 'stretch',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  overviewText: {
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'justify',
    color: 'white',
    lineHeight: 18,
  },
  movieTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: 'yellow',
    fontWeight: '700',
    marginLeft: 4,
  },
  header: {
    marginVertical: 16,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: 'white',
  },
  movieList: {
    flexGrow: 0,
  },
  movieDate: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  movieGenreList: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  movieGenre: {
    backgroundColor: '#8978A4',
    borderRadius: 5,
    padding: 4,
    marginHorizontal: 4,
  },
  movieGenreItem: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
})

export default MovieDetail
