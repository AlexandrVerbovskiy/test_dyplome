const sortCountByMonths = (data, months) => {
  const findMinYearMonth = () => {
    if (data.length === 0) {
      return null;
    }

    let minDate = new Date(data[0].timeCreated);

    data.forEach((item) => {
      const itemDate = new Date(item.timeCreated);
      if (itemDate < minDate) {
        minDate = itemDate;
      }
    });

    return minDate;
  };

  const generateMonthlyReport = (minDate) => {
    const currentDate = new Date();
    let currentMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const report = {};

    while (currentMonth <= currentDate) {
      const label = `${currentMonth.getFullYear()} ${getMonthName(
        currentMonth.getMonth()
      )}`;
      report[label] = 0;

      data.forEach((item) => {
        const itemDate = new Date(item.timeCreated);
        if (
          itemDate.getFullYear() === currentMonth.getFullYear() &&
          itemDate.getMonth() === currentMonth.getMonth()
        ) {
          report[label]++;
        }
      });

      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    return report;
  };

  const getMonthName = (monthIndex) => months[monthIndex];

  const minDate = findMinYearMonth();
  if (!minDate) return [];

  return generateMonthlyReport(minDate);
};

export default sortCountByMonths;
