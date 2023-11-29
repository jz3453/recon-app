import React, { useEffect } from 'react';
import TopBar from './topbar/TopBar';
import StepsOutline from './stepsoutline/StepsOutline';
import './page.css';
import { MenuItem, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const theme = createTheme({
  typography: {
    fontFamily: 'Be Vietnam Pro, sans-serif',
    fontSize: 12,
  },
  palette: {
    text: {
      primary: '#7A7A7A', // Change 'primary' text color to your desired color
    },
  },
});

const SelectTemplate = ({ handleOpportunityType, setStep }) => {
  const [templateType, setTemplateType] = React.useState(null);
  const [displayPreview, setDisplayPreview] = React.useState(false);

  const handleChange = (event) => {
    setTemplateType(event.target.value);
    setDisplayPreview(true);
    handleOpportunityType(event.target.value);
  }

  const handleNext = () => {
    console.log("Next");
    setStep('fill');
  }

  return (
    <div className="page-container">
      <TopBar />
      <div className="main-content-container">
        <div className="main-content">
          <StepsOutline activeStep="choose" />
          <div className="paragraph">
            Select the best template that fits your research opportunity, depending on whether it is a one-time project or a recurring program. A preview of the fields within each template is displayed below. After selecting, click Next.
          </div>
          <div className="dropdown">
            <div className="section-header">Template</div>
            <ThemeProvider theme={theme}>
              <Select
                defaultValue={1}
                value={templateType}
                onChange={handleChange}
                sx={{
                  width: '100%',
                  height: '34px',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <MenuItem value={'program'}>Undergraduate Research Program Title</MenuItem>
                <MenuItem value={'project'}>Undergraduate Research Project Title</MenuItem>
              </Select>
            </ThemeProvider>
          </div>
          { 
            displayPreview && 
            <div className="preview-section">
              <div className="section-header">Template Preview</div>
              <div className="preview-container">
                <div className="section-header">{templateType === 'program' ? "Program Description" : "Project Description"}</div>
                {templateType === 'project' && <div className="paragraph">Provide an overview of the project and description of the student's responsibilities:</div>}
                {templateType === 'program' && <div className="paragraph">Provide an overview of the program and description of the student's responsibilities:</div>}
                <div className="paragraph">Research Mentor name/email/website:</div>
                <div className="section-header">Requirements</div>
                <div className="paragraph">Qualifications:</div>
                <div className="paragraph">Eligibility:</div>
                <div className="section-header">Details</div>
                <div className="paragraph">Lab/Building Location (if available):</div>
                <div className="paragraph">Hours per week:</div>
                <div className="paragraph">Compensation (specify pay rate, course credit, work-study, volunteer, etc.):</div>
                {templateType === 'program' && <div className="paragraph">Program Manager (name and email):</div>}
              </div>
            </div>
          }
          <div className="two-button-container">
            <button className="button">Cancel</button>
            <button 
              className={`button next-button ${!displayPreview ? 'disabled' : 'active'}`}
              disabled={!displayPreview}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTemplate;