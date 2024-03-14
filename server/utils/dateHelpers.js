const timeConverter = (time) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
};

const getDateByCurrentAdd = (clientCurrentTime, daysToAdd = 0) => {
  const date = new Date(clientCurrentTime);
  date.setDate(date.getDate() + daysToAdd);
  date.setHours(23, 59, 59, 999);
  return date;
};

const getDateByCurrentReject = (clientCurrentTime, daysToReject = 0) => {
  const date = new Date(clientCurrentTime);
  date.setDate(date.getDate() - daysToReject);
  date.setHours(0, 0, 0, 0);
  return date;
};

const getOneHourAgo = () => {
  return new Date(Date.now() - 60 * 60 * 1000);
};

const formatDateToSQLFormat = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const clientServerHoursDifference = (clientTime) => {
  const serverTime = Date.now();
  const timeDifference = clientTime - serverTime;
  const hoursDiff = timeDifference / (1000 * 60 * 60);
  return Math.round(hoursDiff);
};

const adaptTimeByHoursDiff = (dateStr, hoursDiff) => {
  const [datePart, timePart] = dateStr.split(" ");
  const [month, day, year] = datePart.split("/").map(Number);
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  let date = new Date(year, month - 1, day, hours, minutes, seconds);
  date.setHours(date.getHours() - hoursDiff);
  return timeConverter(date);
};

const adaptServerTimeToClient = (serverDateStr, clientServerHoursDiff) =>
  adaptTimeByHoursDiff(serverDateStr, -clientServerHoursDiff);

const adaptClientTimeToServer = (clientDateStr, clientServerHoursDiff) =>
  adaptTimeByHoursDiff(clientDateStr, clientServerHoursDiff);

module.exports = {
  timeConverter,
  getOneHourAgo,
  formatDateToSQLFormat,
  clientServerHoursDifference,
  adaptClientTimeToServer,
  adaptServerTimeToClient,
  getDateByCurrentAdd,
  getDateByCurrentReject
};
