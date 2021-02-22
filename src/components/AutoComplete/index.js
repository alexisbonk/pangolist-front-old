import React, { Component } from "react";
import Autocomplete from "react-google-autocomplete";
import { GoogleApiWrapper } from "google-maps-react";

export class MapInput extends Component {
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = (place) => {
    console.log(place);
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());
    this.props.onComplete(place.formatted_address);
  };
  render() {
    return (
      <Autocomplete
        google={this.props.google}
        style={{
          width: "100%",
          height: "40px",
          paddingLeft: "16px",
          marginTop: "2px",
          marginBottom: "100px",
        }}
        onPlaceSelected={this.onPlaceSelected}
        types={["(regions)"]}
      />
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAwOwqk6DPMfuiDtZ1Nk8J1b0urlClQDx4",
})(MapInput);
