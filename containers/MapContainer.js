import React from "react"
import { View } from "react-native"
import MapInput from "../components/MapInput"
import MyMapView from "../components/MapView"
import {
  getLocation,
  geocodeLocationByName,
} from "../services/location-service"
import * as Location from "expo-location"

class MapContainer extends React.Component {
  state = {
    region: {},
    coordsOne: {},
    coordsTwo: {},
  }

  componentDidMount() {
    Location.installWebGeolocationPolyfill()
    this.getInitialState()
  }

  getInitialState() {
    getLocation().then((data) => {
      console.log(data)
      this.setState({
        region: {
          latitude: data.latitude,
          longitude: data.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
      })
    })
  }

  setCoordsOne(loc) {
    this.setState({
      coordsOne: {
        latitude: loc.lat,
        longitude: loc.lng,
      },
    })
  }
  getCoordsFromName(loc) {
    this.setState({
      region: {
        latitude: loc.lat,
        longitude: loc.lng,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
    })
  }
  setCoordsTwo(loc) {
    this.setState({
      coordsTwo: {
        latitude: loc.lat,
        longitude: loc.lng,
      },
    })
  }

  onMapRegionChange(region) {
    this.setState({ region })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.region["latitude"] ? (
          <View style={{ flex: 1 }}>
            <MyMapView
              region={this.state.region}
              coordsOne={this.state.coordsOne}
              coordsTwo={this.state.coordsTwo}
            />
          </View>
        ) : null}
        <View
          style={{
            position: "absolute",
            elevation: 3,
            width: "100%",
          }}>
          <MapInput
            placeholder="From Location"
            notifyChange={(loc) => this.setCoordsOne(loc)}
          />
        </View>
        {/* <View
          style={{
            position: "absolute",
            zIndex: 2,
            top: 55,
            elevation: 3,
            width: "100%",
          }}>
          <MapInput
            placeholder="To Destination"
            notifyChange={(loc) => this.setCoordsTwo(loc)}
          />
        </View> */}
      </View>
    )
  }
}

export default MapContainer
