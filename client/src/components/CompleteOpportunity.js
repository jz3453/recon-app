import React, { useState, useEffect } from 'react';
import TopBar from './topbar/TopBar';
import './page.css';


const CompleteOpportunity = () => {

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <div className="main-section">
            <div className="section-header">Opportunity successfully created!</div>
            <div className="paragraph centered">
              Your opportunity has been successfully created and is now live on the website. To view or manage your applications, visit your application dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CompleteOpportunity;