import React, { useEffect, useState, useRef } from 'react';
import TopBar from './topbar/TopBar';
import StepsOutline from './stepsoutline/StepsOutline';
import './page.css';
import MultipleSelectDropdown from './MultipleSelectDropdown';
import SingleSelectDropdown from './SingleSelectDropdown';
import { years, majors, documentTypes, questionTypes } from '../constants/Constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '@mui/material/Modal';

const defaultQuestion = {
  checkboxChoices: [],
  checkboxOther: false,
  bottomNum: 1,
  topNum: 5,
  topLabel: 'Label (optional)',
  bottomLabel: 'Label (optional)',
  questionText: 'Question',
  questionType: 'Short Answer',
  required: false,
  wordLimit: 0,
  questionId: -1,
};

const CreateApplication = ({ opportunityData, setOpportunityData, handleSubmit, setStep }) => {
  const [applicationType, setApplicationType] = useState(null);
  const [applicationInstructions, setApplicationInstructions] = useState(null);
  const [typeSet, setTypeSet] = useState(false);

  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [minimumTerms, setMinimumTerms] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  const initialDocuments = [
    { type: 'Resume', description: '' },
    { type: 'Transcript', description: '' },
  ];

  const [documents, setDocuments] = useState(initialDocuments);
  const [newDocument, setNewDocument] = useState({});
  const [otherSelected, setOtherSelected] = useState(false);
  const [requiredFilled, setRequiredFilled] = useState(false);

  useEffect(() => {
    setOpportunityData({
      ...opportunityData,
      requiredDocuments: documents,
    });
  }, [documents]);

  const handleDeleteRow = (index) => {
    const updatedDocuments = [...documents];
    updatedDocuments.splice(index, 1);
    setDocuments(updatedDocuments);
  };

  const handleDocumentTypeChange = (event) => {
    const newDoc = {
      type: event.target.value,
    }
    setRequiredFilled(event.target.value !== 'Other');
    setOtherSelected(event.target.value === 'Other');
    setNewDocument(newDoc);
  };

  const handleDocumentName = (event) => {
    const newDoc = {
      type: event.target.value,
    }
    setRequiredFilled(event.target.value !== '');
    setNewDocument(newDoc);
  };

  const handleDocumentDescription = (event) => {
    const newDoc = {
      type: newDocument.type,
      description: event.target.value,
    }
    setNewDocument(newDoc);
  };

  const handleAddDoc = () => {
    setDocuments([...documents, newDocument]);
    setNewDocument({});
    setOtherSelected(false);
    setRequiredFilled(false);
    setModalOpen(false);
  };

  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState(defaultQuestion);
  const [activeIndex, setActiveIndex] = useState(-1);
  const questionsContainerRef = useRef(null);

  // useEffect(() => {
  //   // Attach click event listener to the document
  //   document.addEventListener('click', handleClickOutside);
  //   return () => {
  //     // Remove event listener when component unmounts
  //     document.removeEventListener('click', handleClickOutside);
  //   };
  // }, []);

  // const handleClickOutside = (event) => {
  //   if (questionsContainerRef.current && !questionsContainerRef.current.contains(event.target)) {
  //     setActiveIndex(-1); // Click occurred outside container, deactivate questions
  //   }
  // };

  const handleDropdownClick = (event) => {
    console.log('Dropdown clicked');
    event.stopPropagation(); // Prevent click event from reaching outside container
    // Handle dropdown click logic here
  };

  const handleAddQuestion = () => {
    const qId = questions.length + 1;
    const newQuestion = { ...defaultQuestion, questionId: qId };
    setQuestion(newQuestion);
    setQuestions([...questions, newQuestion]);
    setActiveIndex(qId - 1);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  useEffect(() => {
    setOpportunityData({
      ...opportunityData,
      questions: questions,
    });
  }, [questions]);


  const handleQuestionClick = (index) => {
    setQuestion(questions[index]);
    setActiveIndex(index);
  };

  const handleQuestionTextChange = (event) => {
    const newQ = {
      ...question,
      questionText: event.target.value,
    };
    setQuestion(newQ);
    setQuestions([
      ...questions.slice(0, activeIndex),
      newQ,
      ...questions.slice(activeIndex + 1),
    ]);
  };

  const handleQuestionTypeChange = (event) => {
    const newQ = {
      ...question,
      questionType: event.target.value,
    };
    setQuestion(newQ);
    setQuestions([
      ...questions.slice(0, activeIndex),
      newQ,
      ...questions.slice(activeIndex + 1),
    ]);
  };

  const handleBottomNumChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].bottomNum = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleTopNumChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].topNum = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleScaleLabelChange = (index, event, label) => {
    const updatedQuestions = [...questions];
    if(label === "top") {
      updatedQuestions[index].topLabel = event.target.value;
    } else {
      updatedQuestions[index].bottomLabel = event.target.value;
    }
    setQuestions(updatedQuestions);
  };

  const handleRequiredChange = (index, isChecked) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].required = isChecked;
    setQuestions(updatedQuestions);
  };

  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    const opNum = updatedQuestions[index].checkboxChoices.length + 1;
    updatedQuestions[index].checkboxChoices.push(`Option ${opNum}`);
    setQuestions(updatedQuestions);
  };

  const handleOptionLabelChange = (qindex, cindex, e) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qindex].checkboxChoices[cindex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleDeleteOption = (index, i) => {
    const updatedQuestions = [...questions];
    let choices = updatedQuestions[index].checkboxChoices;
    const updatedChoices = choices.filter((_, it) => it !== i);
    updatedQuestions[index].checkboxChoices = updatedChoices;
    setQuestions(updatedQuestions);
  };

  const handleAddOther = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].checkboxOther = true;
    setQuestions(updatedQuestions);
  };

  const handleDeleteOther = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].checkboxOther = false;
    setQuestions(updatedQuestions);
  };
  

  const handleYearDropdownChange = (event) => {
    setSelectedYears(event.target.value);
    setOpportunityData({
      ...opportunityData,
      eligibility: {
        ...opportunityData.eligibility, // Preserve other fields within eligibility
        years: event.target.value, // Update the 'year' field with selected years
      },
    });
  };

  const handleMajorDropdownChange = (event) => {
    setSelectedMajors(event.target.value);
    setOpportunityData({
      ...opportunityData,
      eligibility: {
        ...opportunityData.eligibility, // Preserve other fields within eligibility
        majors: event.target.value, // Update the 'year' field with selected years
      },
    });
  };

  const handleExperienceSelect = (event) => {
    const isChecked = event.target.checked;
    setOpportunityData({
      ...opportunityData,
      eligibility: {
        ...opportunityData.eligibility, // Preserve other fields within eligibility
        experience: isChecked ? true : null, 
      },
    });
  };

  const handleTermChange = (event) => {
    setMinimumTerms(event.target.value);
    setOpportunityData({
      ...opportunityData,
      eligibility: {
        ...opportunityData.eligibility, // Preserve other fields within eligibility
        minimumTerms: event.target.value, 
      },
    });
  };

  const handleOptionChange = (event) => {
    setApplicationType(event.target.value);
    setOpportunityData({
      ...opportunityData,
      applicationType: event.target.value,
    });
    setTypeSet(true);
  };

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <StepsOutline activeStep="create" />
          <div className="section-box">
            <div className="section-header">Specify your preferred application method for students</div>
            <form className="form">
              <div className="form-option">
                <input 
                  className="radio-button" 
                  type="radio" 
                  name="choice" 
                  value="inside"
                  onChange={handleOptionChange}
                />
                <label className="option-label">Create a custom application on this website</label>
              </div>
              <div className="form-option">
                <input 
                  className="radio-button" 
                  type="radio" 
                  name="choice" 
                  value="outside"
                  onChange={handleOptionChange}
                />
                <label className="option-label">Provide instructions or a link for students to apply outside of this website</label>
              </div>
            </form>
          </div>
          {
            applicationType === 'outside' &&
            <div className="application-instructions">
              <textarea 
                placeholder="Enter application instructions or link here"
                className="text-input instructions"
                onChange={(e) => {
                  setApplicationInstructions(e.target.value);
                  setOpportunityData({
                    ...opportunityData,
                    applicationInstructions: e.target.value,
                  });
                }}
              />
            </div>
          }
          {
            applicationType === 'inside' &&
            <div>
              <div className="section-box">
                <div className="section-header">Candidate Eligibility</div>
                <div className="paragraph">If the specified criteria are not relevant for this position, leave the fields blank</div>
                <div className="subsection">
                  <div className="paragraph">School Year</div>
                  <MultipleSelectDropdown 
                    options={years} 
                    value={selectedYears}
                    handleChange={handleYearDropdownChange}
                  />
                </div>
                <div className="subsection">
                  <div className="paragraph">Major</div>
                  <MultipleSelectDropdown 
                    options={majors} 
                    value={selectedMajors}
                    handleChange={handleMajorDropdownChange}
                  />
                </div>
                <div className="subsection row">
                  <input 
                    className="checkbox" 
                    type="checkbox" 
                    onChange={handleExperienceSelect}
                  />
                  <div className="paragraph">Prior Research Experience</div>
                </div>
                <div className="subsection row">
                  <div className="paragraph">Minimum Terms Available To Work</div>
                  <input 
                    className="term-input" 
                    type="text" 
                    onChange={handleTermChange}
                    value={minimumTerms}
                  />
                </div>
              </div>
              <div className="section-box">
                <div className="section-header">Required Documents</div>
                <table className="documents-table">
                <colgroup>
                  <col style={{ width: '30%' }} />
                  <col style={{ width: '60%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                  <thead>
                    <tr>
                      <th className="column-name">DOCUMENT TYPE</th>
                      <th className="column-name">DESCRIPTION</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((document, index) => (
                      <tr className="table-row" key={index}>
                        <td>
                          {document.type}
                        </td>
                        <td>
                          {document.description}
                        </td>
                        <td>
                          <button className="row-button" onClick={() => handleDeleteRow(index)}>
                            <FontAwesomeIcon className="button-icon" icon="fa-solid fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="button-container">
                  <button
                    className="add-row-button" 
                    onClick={() => setModalOpen(true)}
                  >
                    Add Document
                  </button>
                </div>
                <Modal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                >
                  <div className="modal-container">
                    <div className="section-box">
                      <div className="section-header">Add Document</div>
                      <div className="paragraph">
                        <span className="star">*</span>
                        Are required fields
                      </div>
                      <div className="subsection">
                        <div className="paragraph">
                          Document Type
                          <span className="star">*</span>
                        </div>
                        <SingleSelectDropdown 
                          options={documentTypes} 
                          value={newDocument.type}
                          handleChange={handleDocumentTypeChange}
                        />
                      </div>
                      {
                        otherSelected &&
                        <div className="subsection">
                          <div className="paragraph">
                            Document Name
                            <span className="star">*</span>
                          </div>
                          <input 
                            className="name-input" 
                            type="text" 
                            onChange={handleDocumentName}
                          />
                        </div>
                      }
                      <div className="subsection">
                        <div className="paragraph">Description</div>
                          <textarea 
                            placeholder="Enter a description for the document here"
                            className="text-input description"
                            onChange={handleDocumentDescription}
                          />
                      </div>
                      <div className="two-button-container">
                        <button 
                          className="button"
                          onClick={() => setModalOpen(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className={`button next-button ${!requiredFilled ? 'disabled' : 'active'}`}
                          disabled={!requiredFilled}
                          onClick={() => handleAddDoc()}
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
              <hr />
              <div className="questions-container" ref={questionsContainerRef}>
                {
                  questions.map((question, index) => (
                    <div
                      key={question.id}
                      className={`question ${activeIndex === index ? 'active' : ''}`}
                      onClick={() => handleQuestionClick(index)}
                    >
                      {activeIndex === index && 
                        <div className="question-form">
                          <div className="question-header">
                            <input
                              className="question-text-input"
                              type="text"
                              value={question.questionText}
                              onChange={handleQuestionTextChange}
                            />
                            <div className="question-type">
                              <SingleSelectDropdown 
                                options={questionTypes} 
                                value={question.questionType}
                                handleChange={handleQuestionTypeChange}
                              />
                            </div>
                          </div>
                          {
                            question.questionType === 'Short Answer' &&
                            <div className="question-body">
                              <input
                                className="question-response-input"
                                type="text"
                                value="Short answer text"
                                disabled
                              />
                            </div>
                          }
                          {
                            question.questionType === 'Paragraph' &&
                            <div className="question-body">
                              <input
                                className="question-response-input"
                                type="text"
                                value="Long answer text"
                                disabled
                              />
                            </div>
                          }
                          {
                            question.questionType === 'Checklist' &&
                            <div className="question-body less-space">
                              {
                                question.checkboxChoices.map((choice, i) => (
                                  <div className="checkbox-option">
                                    <input 
                                      className="checkbox" 
                                      type="checkbox" 
                                      disabled
                                    />
                                    <input 
                                      className="checkbox-label" 
                                      type="text"
                                      value={choice}
                                      onChange={(e) => handleOptionLabelChange(index, i, e)}
                                    />
                                    <button className="delete-option-button" onClick={() => handleDeleteOption(index, i)}>
                                      <FontAwesomeIcon className="button-icon" icon="fa-solid fa-x" />
                                    </button>
                                  </div>
                                ))
                              }
                              {
                                question.checkboxOther &&
                                <div className="checkbox-option">
                                  <input 
                                    className="checkbox" 
                                    type="checkbox" 
                                    disabled
                                  />
                                  <input 
                                    className="checkbox-label" 
                                    type="text"
                                    value="Other"
                                    disabled
                                  />
                                  <button className="delete-option-button" onClick={() => handleDeleteOther(index)}>
                                    <FontAwesomeIcon className="button-icon" icon="fa-solid fa-x" />
                                  </button>
                                </div>
                              }
                              <div className="add-options-container">
                                <button
                                  onClick={() => handleAddOption(index)}
                                >
                                  Add Option
                                </button>
                                {
                                  !question.checkboxOther &&
                                  <div className="other-container">
                                    <div>or</div>
                                    <button onClick={() => handleAddOther(index)}>Add Other</button>
                                  </div>
                                }
                              </div>
                            </div>
                          }
                          {
                            question.questionType === 'Linear Scale' &&
                            <div className="question-body less-space">
                              <div className="dropdowns">
                                <div className="number-dropdown">
                                  <SingleSelectDropdown 
                                    options={[0, 1]} 
                                    value={question.bottomNum}
                                    handleChange={(e) => handleBottomNumChange(index, e)}
                                  />
                                </div>
                                <div className="paragraph">to</div>
                                <div className="number-dropdown">
                                  <SingleSelectDropdown 
                                    options={[3, 4, 5, 6, 7, 8, 9, 10]} 
                                    value={question.topNum}
                                    handleChange={(e) => handleTopNumChange(index, e)}
                                  />
                                </div>
                              </div>
                              <div className="dropdown-labels">
                                <div className="dropdown-label">
                                  <div className="dropdown-label-num">{question.bottomNum}</div>
                                  <input
                                    className="scale-label-input"
                                    type="text"
                                    value={question.bottomLabel}
                                    onChange={(e) => handleScaleLabelChange(index, e, "bottom")}
                                  />
                                </div>
                                <div className="dropdown-label">
                                  <div className="dropdown-label-num">{question.topNum}</div>
                                  <input
                                    className="scale-label-input"
                                    type="text"
                                    value={question.topLabel}
                                    onChange={(e) => handleScaleLabelChange(index, e, "top")}
                                  />
                                </div>
                              </div>
                            </div>
                          }
                          <div className="question-footer">
                            <div className="required-container">
                              <div className="toggle-label">Required</div>
                              <label class="toggle">
                                <input 
                                  type="checkbox"
                                  checked={question.required}
                                  onChange={(e) => handleRequiredChange(index, e.target.checked)}
                                />
                                <span class="slider"></span>
                              </label>
                            </div>
                            <button className="delete-question-button" onClick={() => handleDeleteQuestion(index)}>
                              <FontAwesomeIcon className="button-icon" icon="fa-solid fa-trash" />
                            </button>
                          </div>
                        </div>
                      }
                      {activeIndex !== index && 
                        <div className="question-form">
                          <div className="question-header">
                            <div className="question-text">{question.questionText}</div>
                          </div>
                          <div className="question-body less-space">
                            { question.questionType === 'Short Answer' &&
                              <input
                                className="question-response-input"
                                type="text"
                                value="Short answer text"
                                disabled
                              />
                            } 
                            { question.questionType === 'Paragraph' &&
                              <input
                                className="question-response-input"
                                type="text"
                                value="Long answer text"
                                disabled
                              />
                            }
                            {
                              question.questionType === 'Linear Scale' &&
                              <div className="linear-scale-container">
                                <div className="scale-container">
                                  <div className="block left"></div>
                                  <div className="scale-radio-buttons">
                                    {
                                      [...Array(question.topNum - question.bottomNum + 1)].map((_, i) => (
                                        <div className="scale-num">{question.bottomNum + i}</div>
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
                                        />
                                      ))
                                    }
                                  </div>
                                  <div className="block right">{question.topLabel === "Label (optional)" ? null : question.topLabel}</div>
                                </div>
                              </div>
                            }
                            { question.questionType === 'Checklist' &&
                              <div>
                                {
                                question.checkboxChoices.map((choice, i) => (
                                  <div className="checkbox-option">
                                    <input 
                                      className="checkbox" 
                                      type="checkbox" 
                                      disabled
                                    />
                                    <input 
                                      className="checkbox-label wider" 
                                      type="text"
                                      value={choice}
                                      disabled
                                    />
                                  </div>
                                ))
                              }
                              {
                                question.checkboxOther &&
                                <div className="checkbox-option">
                                  <input 
                                    className="checkbox" 
                                    type="checkbox" 
                                    disabled
                                  />
                                  <input 
                                    className="checkbox-label wider" 
                                    type="text"
                                    value="Other"
                                    disabled
                                  />
                                </div>
                              }
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  ))
                }
                <button
                  className="add-question-button" 
                  onClick={handleAddQuestion}
                >
                  Add Question
                </button>
              </div>
            </div>
          }
          <div className="three-button-container">
            <button 
              className="button back-button"
              onClick={() => setStep('fill')}
            >
              Back
            </button>
            <div className="two-button-container">
              <button className="button">Cancel</button>
              <button 
                className={`button next-button ${!typeSet ? 'disabled' : 'active'}`}
                disabled={!typeSet}
                onClick={handleSubmit}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateApplication;