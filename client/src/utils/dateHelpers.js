export const fullTimeFormat = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.toLocaleString("default", {
    month: "short",
  });
  const year = date.getFullYear();

  let formattedTime = "";
  const currentTime = new Date();

  if (currentTime - date < 86400000) {
    formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  } else {
    formattedTime = `${day} ${month}`;
    if (year !== currentTime.getFullYear()) {
      formattedTime += ` ${year}`;
    }
  }

  return formattedTime;
};

export const shortTimeFormat = (timeString) => {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const formatTime = (totalMilliseconds) => {
  const hours = Math.floor(totalMilliseconds / 3600000);
  const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds
    .toString()
    .padStart(3, "0")}`;

  return timeString;
};
