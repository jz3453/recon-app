import React, { useEffect } from 'react';
import TopBar from './topbar/TopBar';
import StepsOutline from './stepsoutline/StepsOutline';
import './page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FillTemplate = ({ handleOpportunityTitle, setStep }) => {
  const [title, setTitle] = React.useState(null);
  const [titleSet, setTitleSet] = React.useState(false);

  useEffect(() => {
    setTitleSet(title !== '' && title !== null);
  }, [title]);

  const handleNext = () => {
    console.log("Next");
    setStep('create');
  }

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <StepsOutline activeStep="fill" />
          <div className="paragraph">
            Please enter a title for your research opportunity. This will be displayed to students on the website. Once entered, click 'Next' to proceed.
          </div>
          <input 
            type="text" 
            placeholder="Enter opportunity title here" 
            className="text-input"
            onChange={(e) => {
              setTitle(e.target.value);
              handleOpportunityTitle(e.target.value);
            }}
          />
          <div className="three-button-container">
            <button 
              className="button back-button"
              onClick={() => setStep('choose')}
            >
              Back
            </button>
            <div className="two-button-container">
              <button className="button">Cancel</button>
              <button 
                className={`button next-button ${!titleSet ? 'disabled' : 'active'}`}
                disabled={!titleSet}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FillTemplate;