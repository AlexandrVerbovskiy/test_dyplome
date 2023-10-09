import { useState } from "react";

const MainFilter = ({ value, onClick = (value) => {} }) => {
  const [filterValue, setFilterValue] = useState(value);

  const handleSearch = () => onClick(filterValue);
  const handleInputEnter = (e) => {
    if (e.key !== "Enter") return;
    onClick(filterValue);
  };

  return (
    <div className="input-group search-filter">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={filterValue}
        onKeyDown={handleInputEnter}
        onInput={(e) => setFilterValue(e.target.value)}
      />
      <button
        type="button"
        onClick={handleSearch}
        className="input-group-text btn btn-primary"
        id="basic-addon2"
      >
        Search
      </button>
    </div>
  );
};

export default MainFilter;
