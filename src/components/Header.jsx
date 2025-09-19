import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <h1>Sample Page Title</h1>
        <div className="header-actions">
          <button className="filters-btn">Sample Filters</button>
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Sample Search" 
              className="search-input"
            />
          </div>
          <button className="add-part-btn">+ Sample Item</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
