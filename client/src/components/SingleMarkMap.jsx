import { Map, MapMarker } from "../components";

const SingleMarkMap = ({ markerTitle, changeCoords, coords }) => {
  return (
    <>
      <Map onClick={changeCoords}>
        {coords && <MapMarker title={markerTitle} pos={coords} />}
      </Map>
    </>
  );
};

export default SingleMarkMap;
