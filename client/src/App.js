import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import CreateOpportunity from './components/CreateOpportunity';
import PostingsDashboard from './components/dashboard/PostingsDashboard';
import ApplicationsDashboard from './components/dashboard/ApplicationsDashboard';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateOpportunity />} />
        <Route path="/dashboard" element={<PostingsDashboard />} />
        <Route path="/dashboard/:opportunityId" element={<ApplicationsDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
library.add(fab, fas, far);