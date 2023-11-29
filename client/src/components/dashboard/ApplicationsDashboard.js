import React, { useState, useEffect } from 'react';
import TopBar from '../topbar/TopBar';
import '../page.css';
import './dashboard.css';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


const ApplicationsDashboard = () => {

  const { opportunityId } = useParams();

  const [applications, setApplications] = useState([]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/get_applications/${opportunityId}`)
      .then(response => {
        setApplications(response.data);
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
      });
  }, []);

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <Link to="/dashboard" className="link-header">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            Back to Opportunities
          </Link>
          <div className="section">
            <div className="section-header">All Applications</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplicationsDashboard;