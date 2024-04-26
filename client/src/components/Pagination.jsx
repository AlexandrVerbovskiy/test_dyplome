import { generatePagination } from "utils";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";

const Pagination = ({ move, canNext, canPrev, page, countPages }) => {
  const visiblePages = generatePagination(page, countPages);

  const handleNextClick = (e) => {
    e.preventDefault();
    if (canNext) move(page + 1);
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    if (canPrev) move(page - 1);
  };

  const handlePageClick = (e, pageNumber) => {
    e.preventDefault();
    if (pageNumber != page) move(pageNumber);
  };

  return (
    <div className="pagination-area text-center">
      <a
        href={
          canPrev ? `/settings/listings?page=${page - 1}` : "/settings/listings"
        }
        className={`prev page-numbers ${canPrev ? "" : "disabled"}`}
        onClick={handlePrevClick}
      >
        <ArrowLeft strokeWidth="1" stroke="white"/>
      </a>

      {visiblePages.map((visiblePage, index) => {
        if (visiblePage == page)
          return (
            <a
              key={visiblePage}
              href={`/settings/listings?page=${visiblePage}`}
              className="page-numbers current"
              onClick={(e) => e.preventDefault()}
            >
              {visiblePage}
            </a>
          );

        if (!visiblePage)
          return (
            <a
              key={visiblePage}
              href="/settings/listings"
              className="page-numbers"
              onClick={(e) => e.preventDefault()}
            >
              ...
            </a>
          );

        return (
          <a
            key={visiblePage}
            href={`/settings/listings?page=${visiblePage}`}
            className="page-numbers"
            onClick={(e) => handlePageClick(e, visiblePage)}
          >
            {visiblePage}
          </a>
        );
      })}

      <a
        href={
          canNext ? `/settings/listings?page=${page + 1}` : "/settings/listings"
        }
        className={`next page-numbers ${canNext ? "" : "disabled"}`}
        onClick={handleNextClick}
      >
        <ArrowRight strokeWidth="1" stroke="white"/>
      </a>
    </div>
  );
};

export default Pagination;
