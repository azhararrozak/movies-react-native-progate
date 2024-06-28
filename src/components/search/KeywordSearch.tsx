import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList } from 'react-native';
import MovieItem from '../movies/MovieItem';
import { FontAwesome } from '@expo/vector-icons'

const API_KEY = process.env.EXPO_PUBLIC_API_ACCESS_TOKEN; // Ganti dengan kunci API TMDB Anda

export default function KeywordSearch(): JSX.Element {
  const [keyword, setKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (): Promise<void> => {
    const url = `https://api.themoviedb.org/3/search/movie?query=${keyword}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`, // Pastikan API_ACCESS_TOKEN didefinisikan sesuai kebutuhan Anda
      },
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setKeyword(text)}
        value={keyword}
        onSubmitEditing={handleSearch}
      />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.noResultsText}>No results found</Text>
        )}
        numColumns={3}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 20,
    color: 'white',
    backgroundColor: '#382645'
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: 'white'
  },
  list: {
    alignItems: 'center',
    padding: 10,
    gap:6,
  },
});
