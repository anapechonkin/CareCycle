import React from 'react';
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
import { FormProvider } from './context/FormContext';
import ErrorBoundary from './components/ErrorBoundary'; // Ensure this path is correct

function App() {
  return (
    <UserProvider>
      <Router>
        <FormProvider>
          <Routes>
            <Route path="/" element={
              <ErrorBoundary>
                <LoginPage />
              </ErrorBoundary>} 
            />
            <Route path="/startQuestionnaire" element={
              <ErrorBoundary>
                <StartQuestionnairePage />
              </ErrorBoundary>} 
            />
            <Route path="/pageOneQuestionnaire" element={
              <ErrorBoundary>
                <PageOneQuestionnaire />
              </ErrorBoundary>} 
            />
            <Route path="/pageTwoQuestionnaire" element={
              <ErrorBoundary>
                <PageTwoQuestionnaire />
              </ErrorBoundary>} 
            />
            <Route path="/pageTwoExtraQuestionnaire" element={
              <ErrorBoundary>
                <PageTwoExtraQuestionnaire />
              </ErrorBoundary>} 
            />
            <Route path="/pageThreeQuestionnaire" element={
              <ErrorBoundary>
                <PageThreeQuestionnaire />
              </ErrorBoundary>} 
            />
            <Route path="/pageFourQuestionnaire" element={
              <ErrorBoundary>
                <PageFourQuestionnaire />
              </ErrorBoundary>} 
            />
            <Route path="/dashboard" element={
              <ErrorBoundary>
                <Dashboard />
              </ErrorBoundary>} 
            />
            <Route path="/userAccount" element={
              <ErrorBoundary>
                <UserAccountPage />
              </ErrorBoundary>} 
            /> 
            <Route path="/clientStatsReport" element={
              <ErrorBoundary>
                <ClientStatsReportPage />
              </ErrorBoundary>} 
            /> 
          </Routes>
        </FormProvider>
      </Router>
    </UserProvider>
  );
}

export default App;
