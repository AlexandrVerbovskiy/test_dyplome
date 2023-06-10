import {Map, MapMarker} from "../components";

const TasksMap = ({
  userPlace,
  tasks,
}) =>
  <>
    <Map>
      {tasks.length && tasks.map(task =><MapMarker key={task.id} title={task.title} pos={task.coords} />)}
      {userPlace &&<MapMarker title={userPlace.title} pos={userPlace.coords} main={true}/> }
    </Map>
  </>;

export default TasksMap;
