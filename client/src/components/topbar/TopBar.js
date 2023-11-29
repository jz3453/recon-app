import React from 'react';
import './topbar.css';
import {Link } from 'react-router-dom';

const TopBar = () => {
  return (
    <div className="top-bar">
      {/* Your website title and profile icon */}
      <div className="title-block">
        <div className="title-columbia">COLUMBIA UNIVERSITY IN THE CITY OF NEW YORK</div>
        <div className="title-research">Undergraduate Research Opportunities</div>
      </div>
      <div className="profile">
        <Link to="/dashboard">
          <button className="profile-icon">BS</button>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;