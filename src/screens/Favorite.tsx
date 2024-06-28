import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/MovieItem';

const Favorite = (): JSX.Element => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, [favorites]);

  const fetchFavorites = async (): Promise<void> => {
    try {
      const favoriteData = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteData !== null) {
        const parsedData = JSON.parse(favoriteData);
        // Ensure each item has an `id` property
        const validFavorites = parsedData.filter((item: any) => item.id);
        setFavorites(validFavorites);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const screenWidth = Dimensions.get('window').width;
  const numColumns = 3;
  const padding = 16;
  const itemWidth = (screenWidth - (padding * (numColumns + 1))) / numColumns;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <View style={{ width: itemWidth, margin: padding / 2 }}>
              <MovieItem movie={item} size={{ width: itemWidth, height: 160 }} coverType="poster" />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
        />
      ) : (
        <Text style={styles.noFavorites}>No favorite movies yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1C1221',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
    textAlign: 'center',
  },
  noFavorites: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

export default Favorite;
