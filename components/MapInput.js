import React from "react"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"
import { GOOGLE_MAPS_APIKEY } from "../Constants"

class MapInput extends React.Component {
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder={this.props.placeholder}
        minLength={2} // minimum length of text to search
        autoFocus={true}
        returnKeyType={"search"} // Can be left out for default return key
        listViewDisplayed={false} // true/false/undefined
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          this.props.notifyChange(details.geometry.location)
        }}
        query={{
          key: GOOGLE_MAPS_APIKEY,
          language: "en",
        }}
        nearbyPlacesAPI="GooglePlacesSearch"
        debounce={300}
      />
    )
  }
}
export default MapInput
