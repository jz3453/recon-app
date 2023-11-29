import React from 'react';
import '../page.css';
import './stepsoutline.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const StepsOutline = ({ activeStep }) => {
  return (
    <div className="steps-outline">
      <span className={activeStep === "choose" ? "active-step" : null}>Choose Template</span>
      <FontAwesomeIcon className="arrow-icon" icon="fa-solid fa-angles-right" />
      <span className={activeStep === "fill" ? "active-step" : null}>Fill Out Template</span>
      <FontAwesomeIcon className="arrow-icon" icon="fa-solid fa-angles-right" />
      <span className={activeStep === "create" ? "active-step" : null}>Create Application</span>
    </div>
  );
};

export default StepsOutline;