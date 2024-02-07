import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StartQuestionnairePage from './pages/StartQuestionnairePage';
import PageOneQuestionnaire from './pages/PageOneQuestionnaire';
import PageTwoQuestionnaire from './pages/PageTwoQuestionnaire';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/startQuestionnaire" element={<StartQuestionnairePage />} />
          <Route path="/pageOneQuestionnaire" element={<PageOneQuestionnaire />} />
          <Route path="/pageTwoQuestionnaire" element={<PageTwoQuestionnaire />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
