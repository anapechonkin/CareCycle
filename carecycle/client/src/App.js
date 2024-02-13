import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import LoginPage from './pages/LoginPage';
import StartQuestionnairePage from './pages/StartQuestionnairePage';
import PageOneQuestionnaire from './pages/PageOneQuestionnaire';
import PageTwoQuestionnaire from './pages/PageTwoQuestionnaire';
import PageThreeQuestionnaire from './pages/PageThreeQuestionnaire';
import PageTwoExtraQuestionnaire from './pages/PageTwoExtraQuestionnaire';
import PageFourQuestionnaire from './pages/PageFourQuestionnaire';
import Dashboard from './pages/Dashboard';
import UserAccountPage from './pages/UserAccountPage'; 
import ClientStatsReportPage from './pages/ClientStatsReportPage'; 

function App() {
  return (
    <UserProvider>
            <Router>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/startQuestionnaire" element={<StartQuestionnairePage />} />
                <Route path="/pageOneQuestionnaire" element={<PageOneQuestionnaire />} />
                <Route path="/pageTwoQuestionnaire" element={<PageTwoQuestionnaire />} />
                <Route path="/pageTwoExtraQuestionnaire" element={<PageTwoExtraQuestionnaire />} />
                <Route path="/pageThreeQuestionnaire" element={<PageThreeQuestionnaire />} />
                <Route path="/pageFourQuestionnaire" element={<PageFourQuestionnaire />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/userAccount" element={<UserAccountPage />} /> 
                <Route path="/clientStatsReport" element={<ClientStatsReportPage />} /> 
              </Routes>
            </Router>
    </UserProvider>
  );
}

export default App;
