const convertDataArrayToObject = (
  array,
  key = "count",
  periodType = "one-month",
  groupType = "sum"
) => {
  const obj = {};
  array.forEach((data) => (obj[data.date] = data[key]));

  let result = {};

  if (periodType == "between-months" || periodType == "one-year") {
    const monthInfo = {};

    Object.keys(obj).forEach((key) => {
      const parts = key.split("-");
      const month = parts[0] + "-" + parts[1];

      if (groupType == "sum") {
        result[month] = (result[month] ?? 0) + obj[key];
      }

      if (groupType == "last") {
        if (monthInfo[month]) {
          const lastMonthDate =
            monthInfo[month].sort()[monthInfo[month].length - 1];

          if (lastMonthDate < key) {
            result[month] = obj[key];
            monthInfo[month] = [...monthInfo[month], key];
          }
        } else {
          result[month] = obj[key];
          monthInfo[month] = [key];
        }
      }
    });

    console.log(result);
  } else if (periodType == "between-years") {
    const yearInfo = {};

    Object.keys(obj).forEach((key) => {
      const parts = key.split("-");
      const year = parts[0];

      if (groupType == "sum") {
        result[year] = (result[year] ?? 0) + obj[key];
      }

      if (groupType == "last") {
        if (yearInfo[year]) {
          const lastYearDate = yearInfo[year].sort()[yearInfo[year].length - 1];

          if (lastYearDate < key) {
            result[year] = obj[key];
            yearInfo[year] = [...yearInfo[year], key];
          }
        } else {
          result[year] = obj[key];
          yearInfo[year] = [key];
        }
      }
    });
  } else {
    result = { ...JSON.parse(JSON.stringify(obj)) };
  }

  return result;
};

const currentDate = new Date();
const currentYear = +currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1;

const typeOptions = [
  { value: "one-month", label: "Month Statistic" },
  { value: "one-year", label: "Year Statistic" },
  { value: "between-years", label: "Year Duration" },
  { value: "between-months", label: "Month Duration" },
];

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const startYear = 2000;

const initYearOptions = () => {
  const yearOptions = [];

  let temp = startYear;
  while (temp <= currentYear) {
    yearOptions.push({ value: temp, label: temp });
    temp++;
  }

  return yearOptions;
};

export default {
  startYear,
  yearOptions: initYearOptions(),
  monthOptions,
  typeOptions,
  convertDataArrayToObject,
  currentMonth,
  currentYear,
};
