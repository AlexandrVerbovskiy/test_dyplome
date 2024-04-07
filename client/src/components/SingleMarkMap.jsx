import React from "react";
import { Map, MapMarker } from "../components";

const SingleMarkMap = ({
  markerTitle,
  changeCoords,
  coords,
  children,
  needCircle = false,
  changeRadius = null,
  radius = null,
}) => {
  console.log(radius);
  return (
    <>
      <Map onClick={changeCoords}>
        {coords && (
          <MapMarker
            title={markerTitle}
            lat={coords?.lat}
            lng={coords?.lng}
            needCircle={needCircle}
            changeRadius={changeRadius}
            radius={radius}
          />
        )}
        {children ? children : <></>}
      </Map>
    </>
  );
};

export default SingleMarkMap;
