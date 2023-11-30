import React from 'react';
import '../page.css';
import './stepsoutline.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Tabs = ({ openTab, setOpenTab, counts }) => {
  return (
    <div className="steps-outline less-space">
      <span onClick={() => setOpenTab('all')} className={openTab === "all" ? "active-step" : null}>
        <div className="tab-text">All</div>
        {counts.all !== 0 && <div className="tab-num">{`(${counts.all})`}</div>}
      </span>
      <span onClick={() => setOpenTab('pending')} className={openTab === "pending" ? "active-step" : null}>
        <div className="tab-text">Pending</div>
        {counts.pending !== 0 && <div className="tab-num">{`(${counts.pending})`}</div>}
      </span>
      <span onClick={() => setOpenTab('interviewing')} className={openTab === "interviewing" ? "active-step" : null}>
        <div className="tab-text">Interviewing</div>
        {counts.interviewing !== 0 && <div className="tab-num">{`(${counts.interviewing})`}</div>}
      </span>
      <span onClick={() => setOpenTab('shortlist')} className={openTab === "shortlist" ? "active-step" : null}>
        <div className="tab-text">Shortlist</div>
        {counts.shortlist !== 0 && <div className="tab-num">{`(${counts.shortlist})`}</div>}
      </span>
      <span onClick={() => setOpenTab('extend-offer')} className={openTab === "extend-offer" ? "active-step" : null}>
        <div className="tab-text">Extend Offer</div>
        {counts['extend-offer'] !== 0 && <div className="tab-num">{`(${counts['extend-offer']})`}</div>}
      </span>
      <span onClick={() => setOpenTab('reject')} className={openTab === "reject" ? "active-step" : null}>
        <div className="tab-text">Reject</div>
        {counts.reject !== 0 && <div className="tab-num">{`(${counts.reject})`}</div>}
      </span>
    </div>
  );
};

export default Tabs;