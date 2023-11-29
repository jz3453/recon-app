import React, { useState, useEffect } from 'react';
import SelectTemplate from './SelectTemplate';
import FillTemplate from './FillTemplate';
import CreateApplication from './CreateApplication';
import CompleteOpportunity from './CompleteOpportunity';
import axios from 'axios';


const CreateOpportunity = () => {
  const [opportunityData, setOpportunityData] = useState({
    opportunityType: '',
    opportunityTitle: '',
    applicationType: '',
    applicationInstructions: '',
    eligibility: {},
    requiredDocuments: [],
    questions: [],
  });

  const [step, setStep] = useState('choose');

  const handleOpportunityType = (type) => {
    setOpportunityData({
      ...opportunityData,
      opportunityType: type,
    });
  };

  const handleOpportunityTitle = (title) => {
    setOpportunityData({
      ...opportunityData,
      opportunityTitle: title,
    });
  };

  useEffect(() => {
    console.log(opportunityData);
  }, [opportunityData]);

  const handleSubmit = () => {
    const currentDate = new Date().toISOString();
    const dataToSend = {
      ...opportunityData,
      postDate: currentDate,
      active: true,
      pendingApplications: 0,
    };
    axios.post('http://127.0.0.1:5000/post_opportunity', dataToSend, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    setStep('complete');
  };

  return (
    <div>
      {step === "choose" && <SelectTemplate handleOpportunityType={handleOpportunityType} setStep={setStep} />}
      {step === "fill" && <FillTemplate handleOpportunityTitle={handleOpportunityTitle} setStep={setStep} />}
      {step === "create" && <CreateApplication opportunityData={opportunityData} setOpportunityData={setOpportunityData} handleSubmit={handleSubmit} setStep={setStep} />}
      {step === "complete" && <CompleteOpportunity />}
    </div>
  );
};
export default CreateOpportunity;