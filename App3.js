import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
// import Autocomplete from "react-native-autocomplete-input"
import MapView from "react-native-maps"
import debounce from "lodash/debounce"
import { GOOGLE_MAPS_APIKEY } from "./Constants"
import { Ionicons } from "@expo/vector-icons"
import {
  Autocomplete,
  withKeyboardAwareScrollView,
} from "react-native-dropdown-autocomplete"

export default function App() {
  // For Filtered Data
  const [filteredFilms, setFilteredFilms] = useState([])
  // For Selected Data
  const [selectedValue, setSelectedValue] = useState({})
  const [search, setSearch] = useState("")

  const findFilm = (search) => {
    setSearch(search)
    // Method called every time when we change the value of the input
    fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${GOOGLE_MAPS_APIKEY}`
    )
      .then((res) => res.json())
      .then((json) => {
        const { results: locs } = json
        console.log({locs})
        setFilteredFilms(locs)
      })

      .catch((e) => {})
  }

  const debouncedCallback = debounce(findFilm, 1000)

  // const {scrollToInput, onDropdownClose, onDropdownShow} = this.props;

  return (
    <View
      style={{
        // ...styles.container,
        marginTop: 40,
        marginRight: 20,
        marginLeft: 20,
        // width: "100%",
      }}>
      <Autocomplete
        inputStyle={styles.input}
        containerStyle={styles.container}
        scrollToInput={(ev) => console.log(ev)}
        handleSelectItem={(item, id) => this.handleSelectItem(item, id)}
        onDropdownClose={() => console.log("drowdownclose")}
        onDropdownShow={() => console.log("drowdownshown")}
        fetchData={debouncedCallback}
        data={filteredFilms}
        minimumCharactersCount={2}
        highlightText
        onChangeText={debouncedCallback}
        valueExtractor={(item) => item.formatted_address}
        rightContent
        rightTextExtractor={(item) => item.name}
        inputContainerStyle={styles.inputContainer}
      />
      <Text>{search}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  autocompletesContainer: {
    paddingTop: 0,
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 8,
  },
  input: { maxHeight: 40 },
  inputContainer: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#c7c6c1",
    // paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: "5%",
    width: "100%",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  plus: {
    position: "absolute",
    left: 15,
    top: 10,
  },
  map: {
    height: 400,
    flex: 1,
  },
})
