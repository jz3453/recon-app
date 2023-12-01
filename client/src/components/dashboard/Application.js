import React, { useState, useEffect } from 'react';
import TopBar from '../topbar/TopBar';
import '../page.css';
import './dashboard.css';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


const Application = () => {
  const { applicationId } = useParams();

  const [application, setApplication] = useState({});

  const fetchApplication = () => {
    axios.get(`http://127.0.0.1:5000/get_application/${applicationId}`)
      .then(response => {
        setApplication(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching application:', error);
      });
  }

  useEffect(() => {
    fetchApplication();
  }, []);

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <Link to="/dashboard" className="link-header">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            Back to Applications
          </Link>
          <div className="section">
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default Application;