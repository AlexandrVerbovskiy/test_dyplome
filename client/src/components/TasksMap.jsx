import React from "react";
import { Map, MapMarker } from ".";

const TasksMap = ({ userPlace, tasks }) => (
  <>
    <Map center={userPlace.coords}>
      {tasks.length &&
        tasks.map((task) => (
          <MapMarker key={task.id} title={task.title} pos={task.coords} />
        ))}
      {userPlace && (
        <MapMarker title={userPlace.title} pos={userPlace.coords} main={true} />
      )}
    </Map>
  </>
);

export default TasksMap;
