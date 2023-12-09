import React, { useState, useEffect } from 'react';
import './topbar.css';
import {Link } from 'react-router-dom';
import axios from 'axios';

const TopBar = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [numNotifs, setNumNotifs] = useState(0);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get_opportunities')
      .then(response => {
        setOpportunities(response.data);
      })
      .catch(error => {
        console.error('Error fetching opportunities:', error);
      });
  }, []);

  useEffect(() => {
    const num = opportunities.reduce((acc, opportunity) => {
      if (opportunity.active)
        return acc + opportunity.pendingApplications;
      else return acc;
    }, 0);
    setNumNotifs(num);
  }, [opportunities]);

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
          {numNotifs !== 0 && <div className="notification-circle-profile">{numNotifs}</div>}
        </Link>
      </div>
    </div>
  );
};

export default TopBar;