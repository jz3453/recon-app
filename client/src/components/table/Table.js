import React from 'react';
import './table.css';
import StatusDropdown from './StatusDropdown';

import { Link, useNavigate } from 'react-router-dom';

const Table = ({ applications, updateStatus, setOpenApplication }) => {

  const navigate = useNavigate();

  const handleNavigation = (application) => {
    navigate(`/details/${application.id}`);
  };

  const options = { month: 'short', day: 'numeric' };

  const onStatusChange = (event, applicationId) => {
    updateStatus(applicationId, event.target.value);
  }

  return (
    <div className="table-container">
      <table className={applications.length === 0 ? "table empty" : "table"}>
        <colgroup>
          <col style={{ width: '20%' }} />
          <col style={{ width: '45%' }} />
          <col style={{ width: '20%' }} />
          <col style={{ width: '15%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="column-name">NAME</th>
            <th className="column-name">NOTES</th>
            <th className="column-name">STATUS</th>
            <th className="column-name">DATE APPLIED</th>
          </tr>
        </thead>
        <tbody>
          {
            applications.map((application, index) => (
              <tr className="table-row" key={index}>
                <td onClick={() => setOpenApplication(application)}>{application.name}</td>
                <td onClick={() => setOpenApplication(application)}>{application.notes}</td>
                <td><StatusDropdown handleChange={(e) => onStatusChange(e, application.id)} value={application.status}/></td>
                <td onClick={() => setOpenApplication(application)}>{new Date(application.applyDate).toLocaleDateString(undefined, options)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {
        applications.length === 0 && (
          <div className="empty-message">No applications to view</div>
        )
      }
    </div>
  );
};

export default Table;