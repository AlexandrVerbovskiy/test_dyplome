import {Map, MapMarker} from "../components";

const SingleMarkMap = ({
  markerTitle,
  changeCoords,
  coords,
  error
}) =>
  <>
    <Map onClick={changeCoords}>
      {coords && <MapMarker title={markerTitle} pos={coords} />}
    </Map>
    {error &&
      <span>
        {error}
      </span>}
  </>;

export default SingleMarkMap;
