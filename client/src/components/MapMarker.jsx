import React, { useState, useRef } from "react";
import { Marker, Circle, InfoWindow } from "@react-google-maps/api";

const MyMarker = ({
  title,
  lat,
  lng,
  main = false,
  needCircle = false,
  changeRadius = null,
  radius = null,
  circleEditable = true,
}) => {
  const [visibleWindow, setVisibleWindow] = useState(false);
  const circleRef = useRef(null);

  return (
    <>
      <Marker
        onLoad={(marker) => {
          const customIcon = (opts) =>
            Object.assign(
              {
                path: "M0 -12c-0 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602",
                fillColor: "blue",
                fillOpacity: 2,
                strokeColor: "red",
                strokeWeight: 2,
                scale: 2,
              },
              opts
            );

          marker.setIcon(
            customIcon({
              fillColor: "transparent",
              strokeColor: main ? "blue" : "red",
            })
          );
        }}
        key={title}
        position={{ lat, lng }}
        onClick={() => setVisibleWindow((prev) => !prev)}
      >
        {visibleWindow && (
          <InfoWindow onCloseClick={() => setVisibleWindow(false)}>
            <div>{title}</div>
          </InfoWindow>
        )}
      </Marker>
      {needCircle && (
        <Circle
          center={{ lat: Number(lat), lng: Number(lng) }}
          radius={radius}
          ref={circleRef}
          options={{
            strokeColor: main ? "blue" : "red",
            strokeWeight: 2,
            fillColor: main ? "blue" : "red",
            draggable: false,
            editable: circleEditable,
          }}
          onRadiusChanged={() => {
            if (!circleRef.current || !changeRadius) return;
            changeRadius(circleRef.current.state.circle.radius);
          }}
        />
      )}
    </>
  );
};

export default MyMarker;
