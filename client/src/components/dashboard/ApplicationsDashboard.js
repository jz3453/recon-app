import React, { useState, useEffect } from 'react';
import TopBar from '../topbar/TopBar';
import Tabs from '../stepsoutline/Tabs';
import Table from '../table/Table';
import StatusDropdown from '../table/StatusDropdown';
import '../page.css';
import './dashboard.css';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '@mui/material/Modal';
import axios from 'axios';


const ApplicationsDashboard = () => {

  const { opportunityId } = useParams();
  const [opportunity, setOpportunity] = useState({});

  const fetchOpportunity = () => {
    axios.get(`http://127.0.0.1:5000/get_opportunity/${opportunityId}`)
      .then(response => {
        setOpportunity(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.error('Error fetching opportunity:', error);
      });
  }

  const [openTab, setOpenTab] = useState('all');

  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [interviewingApplications, setInterviewingApplications] = useState([]);
  const [shortlistApplications, setShortlistApplications] = useState([]);
  const [extendOfferApplications, setExtendOfferApplications] = useState([]);
  const [rejectApplications, setRejectApplications] = useState([]);
  const [tabApplications, setTabApplications] = useState([]); // applications to display in table based on tab [all, pending, interviewing, shortlist, extend-offer, reject
  const [counts, setCounts] = useState({});

  const [openApplication, setOpenApplication] = useState(null);
  const [eligible, setEligible] = useState(true);
  const [eligibilityStats, setEligibilityStats] = useState(null);
  const [notes, setNotes] = useState('');
  const [changeMade, setChangeMade] = useState(false);

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

        if(openApplication !== null) {
          const application = response.data.find(application => application.id === openApplication.id);
          setOpenApplication(application);
        }

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

  const handleNotesChange = (event) => {
    setChangeMade(true);
    setNotes(event.target.value);
  };

  const updateNotes = (applicationId, notes) => {
    setChangeMade(false);
    axios.put(`http://127.0.0.1:5000/update_notes/${applicationId}`, { notes: notes }, {
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
    fetchOpportunity();
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

  useEffect(() => {
    console.log(openApplication)
  }, [openApplication]);

  const findEligible = () => {
    const eligibility = opportunity.eligibility;

    let isEligible = true;
    let eligStats = {};

    if(eligibility?.years && eligibility?.years.length > 0) {
      const years = eligibility?.years;
      const studentYear = openApplication?.eligibility?.year;
      console.log('YEAR: ', studentYear);
      if(years.includes(studentYear)) {
        isEligible = isEligible && true;
        eligStats['year'] = true;
      } else {
        isEligible = isEligible && false;
        eligStats['year'] = false;
      }
    }

    if(eligibility?.majors && eligibility?.majors.length > 0) {
      const majors = eligibility?.majors;
      const studentMajors = openApplication?.eligibility?.majors;
      console.log('MAJORS: ', studentMajors);
      if(studentMajors.some(major => majors.includes(major))) {
        isEligible = isEligible && true;
        eligStats['majors'] = true;
      } else {
        isEligible = isEligible && false;
        eligStats['majors'] = false;
      }
    }
    if(eligibility?.experience) {
      const studentExperience = openApplication?.eligibility?.experience;
      console.log('EXPERIENCE: ', studentExperience);
      isEligible = isEligible && studentExperience;
      eligStats['experience'] = studentExperience;
    }
    if(eligibility?.minTerms && eligibility?.minTerms.length > 0) {
      const studentTerms = openApplication?.eligibility?.minTerms;
      console.log('TERMS: ', studentTerms);
      isEligible = isEligible && studentTerms;
      eligStats['terms'] = studentTerms;
    }
    setEligible(isEligible);
    setEligibilityStats(eligStats);
  };

  useEffect(() => {
    if(openApplication === null) return;
    findEligible();
    setNotes(openApplication?.notes);
    setChangeMade(false);
  }, [openApplication]);


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
            <div className="section-header">Applications</div>
            <Table applications={tabApplications} updateStatus={updateStatus} setOpenApplication={setOpenApplication} />
            <Modal
              open={openApplication !== null}
              onClose={() => setOpenApplication(null)}
            >
              <div className="modal-container">
                <div className="section-box more-padding height-limit">
                  <div className="link-header less" onClick={() => setOpenApplication(null)}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
                  </div>
                  <div className="header-container">
                    <div className="header">{openApplication?.name}</div>
                    <StatusDropdown handleChange={(e) => updateStatus(openApplication?.id, e.target.value)} value={openApplication?.status} />
                  </div>
                  <div className="candidate-info">
                    <div className="info-text">Email: {openApplication?.email}</div>
                    <div className="info-text">Major: {openApplication?.major}</div>
                    <div className="info-text">{openApplication?.school}, {openApplication?.grad_year}</div>
                    { eligibilityStats !== null && 
                      <div className="eligibility-container">
                        <div className="info-text">Eligibility: </div>
                        {
                          Object.keys(eligibilityStats).map((key, index) => (
                            <div key={index} className={eligibilityStats[key] ? "eligibility-stat met" : "eligibility-stat unmet"}>
                              {eligibilityStats[key] ? <FontAwesomeIcon icon="fa-solid fa-check" /> : <FontAwesomeIcon icon="fa-solid fa-times" />} 
                              {key === "experience" ? "prior experience" : key === "terms" ? "min. terms" : key}
                            </div>
                          ))
                        }
                      </div>
                    }
                  </div>
                  <div className="response-container">
                    {
                      opportunity?.questions?.map((question, index) => (
                        <div className="question-container" key={index}>
                          <div className="question-text bold">{question.questionText}</div>
                          {
                            question.questionType === 'Checklist' && (
                              <div className="selections">
                                {
                                  question.checkboxChoices.map((choice, i) => (
                                    <div className="selections-checkbox-option">
                                      <input 
                                        className="checkbox" 
                                        id="response-check"
                                        type="checkbox" 
                                        disabled
                                        checked={openApplication?.answers[index].answer.includes(choice)}
                                      />
                                      <input 
                                        className="checkbox-label" 
                                        type="text"
                                        value={choice}
                                        disabled
                                      />
                                    </div>
                                  ))
                                }
                              </div>
                            )
                          }
                          {
                            question.questionType === 'Linear Scale' && 
                            <div className="linear-scale-container more-space">
                              <div className="scale-container">
                                <div className="block left"></div>
                                <div className="scale-radio-buttons">
                                  {
                                    [...Array(question.topNum - question.bottomNum + 1)].map((_, i) => (
                                      <div className="scale-num smaller">{question.bottomNum + i}</div>
                                    ))
                                  }
                                </div>
                                <div className="block right"></div>
                              </div>
                              <div className="scale-container">
                                <div className="block left">{question.bottomLabel === "Label (optional)" ? null : question.bottomLabel}</div>
                                <div className="scale-radio-buttons">
                                  {
                                    [...Array(question.topNum - question.bottomNum + 1)].map((_, i) => (
                                      <input
                                        type="radio"
                                        name="scale"
                                        className="scale-radio-button"
                                        disabled
                                        checked={openApplication?.answers[index].answer === question.bottomNum + i}
                                      />
                                    ))
                                  }
                                </div>
                                <div className="block right">{question.topLabel === "Label (optional)" ? null : question.topLabel}</div>
                              </div>
                            </div>
                          }
                          {
                            (question.questionType === 'Short Answer' || question.questionType === 'Paragraph') && 
                            <div className="answer">{openApplication?.answers[index].answer}</div>
                          }
                        </div>
                      ))
                    }
                  </div>
                  <div className="notes-section">
                    <div className="section-header">Notes</div>
                    <textarea 
                      placeholder="Provide candidate assessment notes here..."
                      className="text-input notes"
                      value={notes}
                      onChange={(e) => handleNotesChange(e)}
                    />
                    <div className="save-button-container">
                      <button className={changeMade ? "save-note-button primary": "save-note-button"} onClick={() => updateNotes(openApplication?.id, notes)}>
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ApplicationsDashboard;