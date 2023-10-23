import React from "react";
import { Map, MapMarker } from "../components";

const SingleMarkMap = ({ markerTitle, changeCoords, coords }) => {
  return (
    <>
      <Map onClick={changeCoords}>
        {coords && (
          <MapMarker title={markerTitle} lat={coords?.lat} lng={coords?.lng} />
        )}
      </Map>
    </>
  );
};

export default SingleMarkMap;
