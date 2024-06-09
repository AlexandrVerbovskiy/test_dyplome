export const fullTimeFormat = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "";
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const day = date.getDate();
  const month = date.toLocaleString("en-US", {
    month: "short",
  });
  const year = date.getFullYear();

  let formattedTime = "";
  const currentTime = new Date();

  const timeInfo = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  if (currentTime - date < 86400000) {
    formattedTime = timeInfo;
  } else {
    formattedTime = `${day} ${month}`;

    if (year !== currentTime.getFullYear()) {
      formattedTime += ` ${year}`;
    }

    formattedTime += ` ${timeInfo}`;
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

export const getDateByCurrentAdd = (daysToAdd = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 59, 999);
  return date;
};

export const getDateByCurrentReject = (daysToReject = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysToReject);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const timeConverter = (time) => {
  const dateObject = new Date(time);

  const formattedDate = dateObject.toLocaleDateString("en-US");

  const formattedDateParts = formattedDate.split("/");

  const fullFormattedDate =
    `${formattedDateParts[0].length < 2 ? "0" : ""}${formattedDateParts[0]}/` +
    `${formattedDateParts[1].length < 2 ? "0" : ""}${formattedDateParts[1]}/` +
    `${formattedDateParts[2]}`;

  return `${fullFormattedDate}`;
};

export const timeNormalConverter = (time) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}/${day}/${year}`;
};
