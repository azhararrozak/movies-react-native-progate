import React, { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, ImageBackground, FlatList, StyleSheet } from 'react-native';
import MovieItem from '../components/movies/MovieItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MovieDetail = ({ route }: any): any => {
  const [movie, setMovie] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const coverType = 'poster';
  const API_ACCESS_TOKEN = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN;
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
  };

  useEffect(() => {
    getMoviesById();
    getRecomendations();
    checkIfFavorite();
  }, []);

  const getMoviesById = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setMovie(response);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const getRecomendations = (): void => {
    const url = `https://api.themoviedb.org/3/movie/${id}/recommendations`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    fetch(url, options)
      .then(async (response) => await response.json())
      .then((response) => {
        setRecommendations(response.results);
      })
      .catch((errorResponse) => {
        console.log(errorResponse);
      });
  };

  const checkIfFavorite = async () => {
    try {
      const initialData = await AsyncStorage.getItem('@FavoriteList');
      if (initialData !== null) {
        const favMovieList = JSON.parse(initialData);
        const isFav = favMovieList.some((favMovie: any) => favMovie.id === id);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const initialData = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList = initialData !== null ? JSON.parse(initialData) : [];

      if (isFavorite) {
        favMovieList = favMovieList.filter((favMovie: any) => favMovie.id !== id);
      } else {
        favMovieList.push(movie);
      }

      await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        padding: 8,
      }}
    >
      {/* <Text>Movie Detail: {id}</Text> */}
      <ImageBackground
        resizeMode="cover"
        style={styles.backgroundImage}
        // imageStyle={styles.backgroundImageStyle}
        source={{
          uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
        }}
      >
        <Text style={styles.movieTitle}>{movie.original_title}</Text>
        <View style={styles.bottomContainer}>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color="yellow" />
            <Text style={styles.rating}>{movie.vote_average}</Text>
          </View>
          <FontAwesome
            name={isFavorite ? 'heart' : 'heart-o'}
            size={16}
            color="red"
            onPress={toggleFavorite}
          />
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
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    width: 400,
    height: 200,
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
});

export default MovieDetail;
