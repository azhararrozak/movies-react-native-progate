import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/MovieItem';

const Favorite = (): JSX.Element => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    fetchFavorites();
  }, [favorites]);

  const fetchFavorites = async () => {
    try {
      const favoriteData = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteData !== null) {
        const parsedData = JSON.parse(favoriteData);
        // Pastikan setiap item memiliki properti `id`
        const validFavorites = parsedData.filter((item: any) => item.id);
        setFavorites(validFavorites);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Movies</Text>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={({ item }) => (
            <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3} // Menentukan jumlah kolom menjadi 3
          contentContainerStyle={styles.list}
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
    alignContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    gap: 16,
  },
  noFavorites: {
    fontSize: 18,
    color: 'gray',
  },
});

export default Favorite;
