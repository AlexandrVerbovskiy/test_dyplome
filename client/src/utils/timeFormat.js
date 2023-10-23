export const fullTimeFormat = (dateString) => {
  const date = new Date(dateString);
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
