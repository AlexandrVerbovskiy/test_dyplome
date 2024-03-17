const generatePagination = (currentPage, totalPages) => {
  const pagination = [];
  const visiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
  let endPage = Math.min(totalPages, startPage + visiblePages - 1);

  if (totalPages - endPage < Math.floor(visiblePages / 2)) {
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  if (startPage > 1) {
    pagination.push(1);
    if (startPage > 2) {
      pagination.push(null);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pagination.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pagination.push(null);
    }
    pagination.push(totalPages);
  }

  return pagination;
};

export default generatePagination;
