import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import MapView from "react-native-maps";
import debounce from "lodash/debounce";

export default function App() {
  // For Filtered Data
  const [filteredFilms, setFilteredFilms] = useState([]);
  // For Selected Data
  const [selectedValue, setSelectedValue] = useState({});
  const [search, setSearch] = useState("");

  const findFilm = (search) => {
    // Method called every time when we change the value of the input
    fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=AIzaSyACND5A2kxyWGf3KYmtY4rkY862Cp0oaJI`
    )
      .then((res) => res.json())
      .then((json) => {
        const { results: locs } = json;
        console.log(locs.length);
        setFilteredFilms(locs);
      })
      .catch((e) => {});
  };

  const debouncedCallback = debounce(findFilm, 1000);

  return (
    <View style={{ flex: 1, marginTop: 30 }}>
      <Autocomplete
        autoCapitalize="none"
        autoCorrect={false}
        data={filteredFilms}
        defaultValue={
          JSON.stringify(selectedValue) === "{}" ? "" : selectedValue.name
        }
        onChangeText={debouncedCallback}
        placeholder="Enter the film title"
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedValue(item);
              setFilteredFilms([]);
            }}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text>{search}</Text>
      <MapView
        style={{ ...styles.map }}
        showsUserLocation
        followUserLocation={true}
        zoomEnabled={true}
        showsMyLocationButton={true}
        showsCompass
        textStyle={{ color: "#bc8b00" }}
        containerStyle={{ backgroundColor: "white", borderColor: "#BC8B00" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 400,
    flex: 1,
  },
});
