import React from "react"
import MapView, { Marker } from "react-native-maps"

const MyMapView = (props) => {
  return (
    <MapView style={{ flex: 1 }} region={props.region}>
      {props.coordsOne ? <Marker coordinate={props.coordsOne} /> : null}
      {props.coordsTwo ? <Marker coordinate={props.coordsTwo} /> : null}
    </MapView>
  )
}
export default MyMapView
