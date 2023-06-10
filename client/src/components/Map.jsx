import React, { useState } from "react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import config from "../config";

const {MAP_DEFAULT} = config;

const Map=({
    children,
    onClick = ()=>{},
  height =MAP_DEFAULT.height,
  center = MAP_DEFAULT.center,
  width= MAP_DEFAULT.width,
})=> {

  const [map, setMap] = useState(null)

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: ""
  })

  const onLoad = function callback(map) {
    new window.google.maps.LatLngBounds(center);
    setMap(map)
  }

  const onUnmount = function callback(map) {
    setMap(null)
  }

  const handleMapClick = e => {
    onClick(e.latLng.toJSON());
  };

  if(!isLoaded) return <></>;

  return (
      <GoogleMap
        center={center}
        zoom={4}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        mapContainerStyle={{ height, width}}
        className="my-map"
      >
        {children??""}
      </GoogleMap>
  );
}

export default Map;
