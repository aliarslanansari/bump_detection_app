import React, { Component } from "react"
import {
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
} from "react-native"

import MapView from "react-native-maps"
import { Marker } from "react-native-maps"
import * as Location from "expo-location"
import MapViewDirections from "react-native-maps-directions"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

const { width, height } = Dimensions.get("window")
const ASPECT_RATIO = width / height
const LATITUDE = 37.3317876
const LONGITUDE = -122.0054812
const LATITUDE_DELTA = 0.000922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

const GOOGLE_MAPS_APIKEY = "AIzaSyDVbMbdxEBeurNl_JGns9e_j5ONiZn8PoU"

import { NativeModules } from "react-native"
import CustomMarker from "./CustomMarker"
const reactNativeVersion = NativeModules.PlatformConstants.reactNativeVersion
const reactNativeVersionString = reactNativeVersion
  ? `${reactNativeVersion.major}.${reactNativeVersion.minor}.${
      reactNativeVersion.patch
    }${reactNativeVersion.prerelease ? " pre-release" : ""}`
  : ""

const reactNativeMapsVersion = require("react-native-maps/package").version
const reactNativeMapsDirectionsVersion = require("react-native-maps-directions/package")
  .version

const styles = StyleSheet.create({
  versionBox: {
    position: "absolute",
    bottom: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  versionText: {
    padding: 4,
    backgroundColor: "#FFF",
    color: "#000",
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  text: {
    color: "red",
  },
})

const bumpLocation = [
  { longitude: 74.79596324265003, latitude: 20.900990153051872 },
  { longitude: 74.82511583715677, latitude: 20.894221124174884 },
  { longitude: 74.85649634152651, latitude: 20.90498389659111 },
  { longitude: 74.87106408923864, latitude: 20.920766458670116 },
  { longitude: 74.8960542306304, latitude: 20.938375772884783 },
  { longitude: 74.93357263505459, latitude: 20.95792515976357 },
  { longitude: 74.96521297842264, latitude: 20.974777195134156 },
  { longitude: 74.99459221959114, latitude: 21.001168334150364 },
  { longitude: 75.02457931637764, latitude: 21.021286924875596 },
  { longitude: 75.05597691982985, latitude: 21.041041377791064 },
  // { longitude: 75.07138285785913, latitude: 21.04132425818175 },
  // { longitude: 75.08707210421561, latitude: 21.051938455798844 },
  // { longitude: 75.1059028878808, latitude: 21.101542067415878 },
  // { longitude: 75.10598704218864, latitude: 21.1014476036585 },
]

class Example extends Component {
  constructor(props) {
    super(props)

    this.state = {
      coordinates: [
        {
          latitude: 20.9051019752265,
          longitude: 74.77519690990448,
          title: "Foo Place",
          subtitle: "1234 Foo Drive",
        },
        {
          latitude: 20.90344792624504,
          longitude: 74.78311713784933,
          title: "Foo Place",
          subtitle: "1234 Foo Drive",
        },
      ],
    }

    this.mapView = null
  }

  onMapPress = (e) => {
    console.log(JSON.stringify(e.nativeEvent, null, 2))
    // this.setState({
    //   coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    // })
  }

  onReady = (result) => {
    this.mapView.fitToCoordinates(result.coordinates, {
      edgePadding: {
        right: width / 10,
        bottom: height / 10,
        left: width / 10,
        top: height / 10,
      },
    })
  }

  onError = (errorMessage) => {
    console.log(errorMessage)
  }

  setDistance(distance, duration_in_traffic) {
    // console.log('setDistance');
    this.setState({
      distance: parseFloat(distance),
      durationInTraffic: parseInt(duration_in_traffic),
    })
  }

  componentDidMount() {
    Location.installWebGeolocationPolyfill()
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = parseFloat(position.coords.latitude)
        let long = parseFloat(position.coords.longitude)

        let initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }

        this.setState({ initialPosition: initialRegion })
      },
      (error) => alert(JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000 }
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={this.state.initialPosition}
          style={{ flex: 1 }}
          ref={(c) => (this.mapView = c)} // eslint-disable-line react/jsx-no-bind
          onPress={this.onMapPress}>
          {this.state.coordinates.map((coordinate, index) => (
            <Marker key={`coordinate_${index}`} coordinate={coordinate} />
          ))}

          {bumpLocation.map((coordinate, index) => (
            <Marker
              pinColor="blue"
              key={`coordinate_bump_${index}`}
              coordinate={coordinate}
            />
          ))}
          <MapViewDirections
            origin={this.state.coordinates[0]}
            destination={
              this.state.coordinates[this.state.coordinates.length - 1]
            }
            waypoints={this.state.coordinates.slice(1, -1)}
            mode="DRIVING"
            apikey={GOOGLE_MAPS_APIKEY}
            language="en"
            strokeWidth={4}
            strokeColor="red"
            onStart={(params) => {
              console.log(
                `Started routing between "${params.origin}" and "${
                  params.destination
                }"${
                  params.waypoints.length
                    ? " using waypoints: " + params.waypoints.join(", ")
                    : ""
                }`
              )
            }}
            onReady={this.onReady}
            onError={(errorMessage) => {
              console.log(errorMessage)
            }}
            resetOnChange={false}
          />
        </MapView>
        <View
          style={{
            position: "absolute",
            zIndex: 2,
            top: 55,
            elevation: 3,
            width: "100%",
          }}>
          <GooglePlacesAutocomplete
            placeholder="From Location"
            onPress={(data, details = null) => {
              this.setState({
                coordinates: [
                  {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  },
                  this.state.coordinates[1],
                ],
              })
              console.log(details.geometry.location, details.formatted_address)
            }}
            fetchDetails
            debounce={300}
            minLength={2} // minimum length of text to search
            autoFocus={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
          />
        </View>
        <View
          style={{
            position: "absolute",
            zIndex: 2,
            top: 110,
            elevation: 3,
            width: "100%",
          }}>
          <GooglePlacesAutocomplete
            placeholder="To Destination"
            onPress={(data, details = null) => {
              this.setState({
                coordinates: [
                  this.state.coordinates[1],
                  {
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  },
                ],
              })
              console.log(details.geometry.location, details.formatted_address)
            }}
            fetchDetails
            debounce={300}
            minLength={2} // minimum length of text to search
            autoFocus={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
          />
        </View>
      </View>
    )
  }
}

export default Example
