import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import StartQuestionnairePage from './pages/StartQuestionnairePage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/startQuestionnaire" element={<StartQuestionnairePage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
