import React, { useState, useEffect } from 'react';
import TopBar from '../topbar/TopBar';
import Tabs from '../stepsoutline/Tabs';
import Table from '../table/Table';
import '../page.css';
import './dashboard.css';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';


const ApplicationsDashboard = () => {

  const { opportunityId } = useParams();

  const [openTab, setOpenTab] = useState('all');

  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [interviewingApplications, setInterviewingApplications] = useState([]);
  const [shortlistApplications, setShortlistApplications] = useState([]);
  const [extendOfferApplications, setExtendOfferApplications] = useState([]);
  const [rejectApplications, setRejectApplications] = useState([]);
  const [tabApplications, setTabApplications] = useState([]); // applications to display in table based on tab [all, pending, interviewing, shortlist, extend-offer, reject
  const [counts, setCounts] = useState({});

  const fetchApplications = () => {
    axios.get(`http://127.0.0.1:5000/get_applications/${opportunityId}`)
      .then(response => {
        setApplications(response.data);

        const pending = response.data.filter(application => application.status === 'pending');
        setPendingApplications(pending);
        const interviewing = response.data.filter(application => application.status === 'interviewing');
        setInterviewingApplications(interviewing);
        const shortlist = response.data.filter(application => application.status === 'shortlist');
        setShortlistApplications(shortlist);
        const extendOffer = response.data.filter(application => application.status === 'extend-offer');
        setExtendOfferApplications(extendOffer);
        const reject = response.data.filter(application => application.status === 'reject');
        setRejectApplications(reject);

        if(openTab === 'all') setTabApplications(response.data);
        else if(openTab === 'pending') setTabApplications(pending);
        else if(openTab === 'interviewing') setTabApplications(interviewing);
        else if(openTab === 'shortlist') setTabApplications(shortlist);
        else if(openTab === 'extend-offer') setTabApplications(extendOffer);
        else if(openTab === 'reject') setTabApplications(reject);

        setCounts({
          all: response.data.length,
          pending: pending.length,
          interviewing: interviewing.length,
          shortlist: shortlist.length,
          'extend-offer': extendOffer.length,
          reject: reject.length,
        });
      })
      .catch(error => {
        console.error('Error fetching applications:', error);
      });
  }

  const updateStatus = (applicationId, newStatus) => {
    console.log(openTab);
    axios.put(`http://127.0.0.1:5000/update_status/${applicationId}`, { status: newStatus }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        fetchApplications();
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (openTab === 'all') {
      setTabApplications(applications);
    } else if (openTab === 'pending') {
      setTabApplications(pendingApplications);
    } else if (openTab === 'interviewing') {
      setTabApplications(interviewingApplications);
    } else if (openTab === 'shortlist') {
      setTabApplications(shortlistApplications);
    } else if (openTab === 'extend-offer') {
      setTabApplications(extendOfferApplications);
    } else if (openTab === 'reject') {
      setTabApplications(rejectApplications);
    }
  }, [openTab]);


  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <Link to="/dashboard" className="link-header">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            Back to Opportunities
          </Link>
          <Tabs openTab={openTab} setOpenTab={setOpenTab} counts={counts} />
          <div className="section">
            <div className="section-header"></div>
            <Table applications={tabApplications} updateStatus={updateStatus} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplicationsDashboard;