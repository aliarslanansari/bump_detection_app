import React, { PureComponent } from "react"
import { Image } from "react-native"
import { Marker } from "react-native-maps"
export default class CustomMarker extends PureComponent {
  constructor() {
    super()
    this.state = {
      tracksViewChanges: true,
    }
  }
  stopTrackingViewChanges = () => {
    this.setState(() => ({
      tracksViewChanges: false,
    }))
  }
  render() {
    const { tracksViewChanges } = this.state
    const { coordinate } = this.props
    return (
      <Marker coordinate={coordinate} tracksViewChanges={tracksViewChanges}>
        <Image
          onLoad={this.stopTrackingViewChanges}
          fadeDuration={0}
          source={{
            uri:
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==",
          }}
        />
      </Marker>
    )
  }
}
