import React, { useState, useEffect } from 'react';
import TopBar from '../topbar/TopBar';
import Tabs from '../stepsoutline/Tabs';
import Table from '../table/Table';
import StatusDropdown from '../table/StatusDropdown';
import AppStatusDropdown from './AppStatusDropdown';
import '../page.css';
import './dashboard.css';
import { Link, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '@mui/material/Modal';
import axios from 'axios';

const convertToCSV = (applications) => {
  // const csvRows = [];
  const application = applications[0];
  // const headers = Object.keys(applications[0]);
  let headersSet = new Set();
  Object.keys(application).forEach(key => {
    if (key === 'answers') {
      application.answers.forEach(answer => {
        headersSet.add(`Answer: ${answer.questionText}`);
      });
    } else if (key === 'eligibility') {
      Object.keys(application.eligibility).forEach(key => {
        headersSet.add(`eligibility - ${key === 'experience' ? 'prior research experience' : key === 'minimumTerms' ? 'terms available' : key}`);
      });
    } else {
      headersSet.add(key);
    }
  });
  console.log(headersSet);
  const headers = Array.from(headersSet);
  const csvRows = [];
  csvRows.push(headers.join(','));
  for (const row of applications) {
    const values = headers.map(header => {
      if (header.includes('Answer')) {
        const answers = row.answers.map(answer => {
          console.log(answer)
          const escaped = ('' + answer.answer).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        return answers.join(',');
      } else if (header === 'eligibility') {
        const eligibility = Object.keys(row.eligibility).map(key => {
          const escaped = ('' + row.eligibility[key]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        return eligibility.join(',');
      } else {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      }
    });
    csvRows.push(values.join(','));
  }
  return csvRows.join('\n');
};

const downloadCSV = (applications) => { 
  const csvContent = convertToCSV(applications);
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'applications.csv';
  link.click();
};


const ApplicationsDashboard = () => {

  const { opportunityId } = useParams();
  const [opportunity, setOpportunity] = useState({});

  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const fetchOpportunity = () => {
    axios.get(`http://127.0.0.1:5000/get_opportunity/${opportunityId}`)
      .then(response => {
        setOpportunity(response.data);
        const eligibility = response.data.eligibility;
        let conditions = [];
        if(eligibility?.years && eligibility?.years.length > 0) {
          conditions.push("year");
        }
        if(eligibility?.majors && eligibility?.majors.length > 0) {
          conditions.push("major");
        }
        if(eligibility?.experience) {
          conditions.push("experience");
        }
        if(eligibility?.minimumTerms && eligibility?.minimumTerms.length > 0) {
          conditions.push("terms");
        }
        setEligibilityConditions(conditions);
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
  const [filteredApplications, setFilteredApplications] = useState([]); // applications to display in table based on filter [all, pending, interviewing, shortlist, extend-offer, reject
  const [counts, setCounts] = useState({});

  const [openApplication, setOpenApplication] = useState(null);
  const [eligible, setEligible] = useState(true);
  const [eligibilityStats, setEligibilityStats] = useState(null);
  const [eligibilityConditions, setEligibilityConditions] = useState([]);
  const [filterConditions, setFilterConditions] = useState([]);
  const [notes, setNotes] = useState('');
  const [changeMade, setChangeMade] = useState(false);

  const filterConditionChange = (e, condition) => {
    console.log(condition, e.target.checked);
    if(e.target.checked) {
      setFilterConditions([...filterConditions, condition]);
      filterApplications(tabApplications);
    } else {
      console.log(filterConditions.includes(condition));
      setFilterConditions(filterConditions.filter(item => item !== condition));
      filterApplications(tabApplications);
    }
  }

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

        filterApplications(pending);

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

  const filterApplications = (tabapps) => {

    const filtered = tabapps.filter(application => {
      let isEligible = true;
      if(filterConditions.includes("year")) {
        isEligible = isEligible && application?.eligibility?.year[0];
      }
      if(filterConditions.includes("major")) {
        isEligible = isEligible && application?.eligibility?.majors[0];
      }
      if(filterConditions.includes("experience")) {
        isEligible = isEligible && application?.eligibility?.experience[0];
      }
      if(filterConditions.includes("terms")) {
        isEligible = isEligible && application?.eligibility?.minimumTerms[0];
      }
      return isEligible;
    });
    console.log(filtered);
    setFilteredApplications(filtered);
  }

  useEffect(() => {
    filterApplications(tabApplications);
  }, [filterConditions]);

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


  const updateOpportunityStatus = (opportunityId, newStatus) => {
    const newActive = newStatus === 'Active';
    axios.put(`http://127.0.0.1:5000/update_opportunitystatus/${opportunityId}`, { active: newActive }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        fetchOpportunity();
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
    setFilterConditions([]);
    setFilteredApplications(tabApplications);
  }, [openTab]);

  useEffect(() => {
    console.log(openApplication)
  }, [openApplication]);

  const findEligible = () => {
    const eligibility = opportunity.eligibility;

    let isEligible = true;
    let eligStats = {};

    if(eligibility?.years && eligibility?.years.length > 0) {
      const yearEligible = openApplication?.eligibility?.year[0];
      isEligible = isEligible && yearEligible;
      eligStats['year'] = yearEligible;
      console.log("YEAR");
    }

    if(eligibility?.majors && eligibility?.majors.length > 0) {
      const majorEligible = openApplication?.eligibility?.majors[0];
      isEligible = isEligible && majorEligible;
      eligStats['majors'] = majorEligible;
      console.log("MAJOR");
    }
    if(eligibility?.experience) {
      const studentExperience = openApplication?.eligibility?.experience[0];
      isEligible = isEligible && studentExperience;
      eligStats['experience'] = studentExperience;
      console.log("EXPERIENCE");
    }
    if(eligibility?.minimumTerms && eligibility?.minimumTerms.length > 0) {
      const termsEligible = openApplication?.eligibility?.minimumTerms[0];
      isEligible = isEligible && termsEligible;
      eligStats['terms'] = termsEligible;
      console.log("TERMS");
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

  useEffect(() => {
    setConfirmed(false);
  }, [opportunity]);


  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <Link to="/dashboard" className="link-header">
            <FontAwesomeIcon icon="fa-solid fa-arrow-left" />
            Back to Opportunities
          </Link>
          <div className="research-title-header">
            <div className="research-title">
              {opportunity.opportunityTitle}
            </div>
            <div className="opportunity-status">
              <div className="small-header">STATUS: </div>
              <AppStatusDropdown handleChange={(e) => {
                if(opportunity.active) {
                  setWarningModalOpen(true);
                } else {
                  updateOpportunityStatus(opportunity.id, e.target.value);
                }
              }} value={opportunity.active} />
            </div>
            <Modal
              open={warningModalOpen}
              onClose={() => setWarningModalOpen(false)}
            >
              <div className="modal-container">
                <div className="warning-modal-box">
                  <div className="paragraph bolded">Archive Opportunity</div>
                  <div className="text">
                    Are you sure you want to archive and close applications for{' '}
                    <span className="bold-text">
                      {opportunity.opportunityTitle}
                    </span>
                    ?
                  </div>
                  <div className="warning-box">
                    <div className="warning-header">
                      <FontAwesomeIcon icon="fa-solid fa-triangle-exclamation" className="warning-icon" />
                      <div className="warning-header-text">Warning</div>
                    </div>
                    <div className="text warning">Archiving this post will trigger notifications to all current applicants, informing them that this opportunity is no longer available. </div>
                  </div>
                  <div className="two-button-container smaller-version">
                    <button 
                      className="button smaller"
                      onClick={() => setWarningModalOpen(false)}
                    >
                      No, Cancel
                    </button>
                    <button 
                      className={`button smaller next-button active`}
                      onClick={() => {
                        setConfirmed(true);
                        setWarningModalOpen(false);
                        updateOpportunityStatus(opportunity.id, false);
                      }}
                    >
                      Yes, Archive
                    </button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
          <Tabs openTab={openTab} setOpenTab={setOpenTab} counts={counts} />
          <div className="section">
            <div className="applications-header">
              <div className="section-header">Applications</div>
              <div className="export-button-container">
                <button disabled={openTab === 'pending' ? filteredApplications.length === 0 : tabApplications.length === 0} className="export-button" onClick={() => {openTab === 'pending' ? downloadCSV(filteredApplications) : downloadCSV(tabApplications)}}>Export CSV</button>
                <button disabled={openTab === 'pending' ? filteredApplications.length === 0 : tabApplications.length === 0} className="export-button">Export Documents</button>
              </div>
            </div>
            {
              openTab === 'pending' && (
                <div className="eligibility-container-box">
                  <div className="container-prompt">Exclude students who do not meet eligibility for: </div>
                  {
                    eligibilityConditions?.map((condition, index) => (
                      <div key={index} className="condition">
                        <input 
                          className="checkbox" 
                          type="checkbox" 
                          onChange={(e) => filterConditionChange(e, condition)}
                        />
                        <div className="condition-text">
                          {condition === "year" ? "School Year" : condition === "major" ? "Major" : condition === "experience" ? "Prior Research Experience" : "Minimum Terms Available to Work"}
                        </div>
                      </div>
                    ))
                  }
                </div>
              )
            }
            {openTab === 'pending' && <Table applications={filteredApplications} updateStatus={updateStatus} setOpenApplication={setOpenApplication} />}
            {openTab !== 'pending' && <Table applications={tabApplications} updateStatus={updateStatus} setOpenApplication={setOpenApplication} />}
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
                              {eligibilityStats[key] ? <FontAwesomeIcon icon="fa-solid fa-check" className="eligibility-icon" /> : <FontAwesomeIcon icon="fa-solid fa-times" className="eligibility-icon" />} 
                              {key === "experience" ? "prior experience" : key === "terms" ? `min. terms - ${openApplication?.eligibility?.minimumTerms[1]}` : key}
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