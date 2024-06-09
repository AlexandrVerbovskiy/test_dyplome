const getQueryParams = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  // Отримання всіх параметрів запиту
  const queryParams = {};
  for (const [key, value] of urlParams.entries()) {
    queryParams[key] = value;
  }

  return queryParams;
};

export default getQueryParams;
