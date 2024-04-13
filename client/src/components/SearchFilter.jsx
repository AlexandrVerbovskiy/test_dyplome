import React, { useState } from 'react';

const SearchFilter = ({ filter, changeFilter }) => {
  const [inputValue, setInputValue] = useState(filter);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      changeFilter(value);
    }, 500);

    setTypingTimeout(newTimeout);
  };

  return (
    <div className="input-group search-filter">
      <input
        type="text"
        className="form-control"
        placeholder="Search..."
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
};

export default SearchFilter;