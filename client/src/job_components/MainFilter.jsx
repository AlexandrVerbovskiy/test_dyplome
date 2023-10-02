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
      <span
        onClick={handleSearch}
        className="input-group-text"
        id="basic-addon2"
      >
        Search
      </span>
    </div>
  );
};

export default MainFilter;
