import React, { Component } from "react"
import { Dimensions, StyleSheet, View, Text } from "react-native"
import MapView from "react-native-maps"

import MapViewDirections from "react-native-maps-directions"

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

const reactNativeMapsVersion = require("./node_modules/react-native-maps/package.json")
  .version
const reactNativeMapsDirectionsVersion = require("./node_modules/react-native-maps-directions/package.json")
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
})

class Example extends Component {
  constructor(props) {
    super(props)

    this.state = {
      coordinates: [
        {
          latitude: 20.9051019752265,
          longitude: 74.77519690990448,
          title: 'Foo Place',
          subtitle: '1234 Foo Drive'
        },
        {
          latitude: 20.90344792624504,
          longitude: 74.78311713784933,
          title: 'Foo Place',
          subtitle: '1234 Foo Drive'
        }
      ],
    }

    this.mapView = null
  }

  onMapPress = (e) => {
      console.log(JSON.stringify(e.nativeEvent,null,2))
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
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = parseFloat(position.coords.latitude)
      let long = parseFloat(position.coords.longitude)

      let initialRegion = {
        latitude: lat,
        longitude: long,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }

      this.setState({initialPosition: initialRegion})
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000});
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          initialRegion={this.state.initialPosition}
          style={StyleSheet.absoluteFill}
          ref={(c) => (this.mapView = c)} // eslint-disable-line react/jsx-no-bind
          onPress={this.onMapPress}>
          {this.state.coordinates.map((coordinate, index) => (
            <CustomMarker
              key={`coordinate_${index}`}
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
        <View style={styles.versionBox}>
          <Text style={styles.versionText}>
            RN {reactNativeVersionString}, RNM: {reactNativeMapsVersion}, RNMD:{" "}
            {reactNativeMapsDirectionsVersion}
          </Text>
        </View>
      </View>
    )
  }
}

export default Example
