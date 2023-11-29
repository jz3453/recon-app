import React, { useState, useEffect } from 'react';
import TopBar from '../topbar/TopBar';
import '../page.css';
import './dashboard.css';
import {Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


const PostingsDashboard = () => {

  const [opportunities, setOpportunities] = useState([]);
  const [activeOpportunities, setActiveOpportunities] = useState([]);
  const [inactiveOpportunities, setInactiveOpportunities] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/get_opportunities')
      .then(response => {
        setOpportunities(response.data);

        const active = response.data.filter(opportunity => opportunity.active);
        const inactive = response.data.filter(opportunity => !opportunity.active);
        setActiveOpportunities(active);
        setInactiveOpportunities(inactive);
      })
      .catch(error => {
        console.error('Error fetching opportunities:', error);
      });
  }, []);

  const sortedActiveOpportunities = activeOpportunities.sort((a, b) => {
    return new Date(b.postDate) - new Date(a.postDate);
  });

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <Link className="link-header">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            Back to Opportunities
          </Link>
          <div className="section">
            <div className="section-header">Active Postings</div>
            {
              sortedActiveOpportunities.map((opportunity, index) => (
                <Link to={`/dashboard/${opportunity.id}`} className="posting" key={index}>
                  <div className="post-left">
                    <div className="post-text posting-title">{opportunity.opportunityTitle}</div>
                    {opportunity.pendingApplications !== 0 && <div className="notification-circle">{opportunity.pendingApplications}</div>}
                  </div>
                  <div className="post-text posting-date">{`Posted ${new Date(opportunity.postDate).toLocaleDateString()}`}</div>
                </Link>
              ))
            }
          </div>
          <div className="section">
            <div className="section-header">Archived Postings</div>
            {
              inactiveOpportunities.map((opportunity, index) => (
                <Link to={`/dashboard/${opportunity.id}`} className="posting" key={index}>
                  <div className="post-left">
                    <div className="post-text posting-title">{opportunity.opportunityTitle}</div>
                  </div>
                  <div className="post-text posting-date">{`Posted ${new Date(opportunity.postDate).toLocaleDateString()}`}</div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostingsDashboard;