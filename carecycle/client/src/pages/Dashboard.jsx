import React, { useEffect, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DashboardContainer from "../components/DashboardContainer";
import DashboardContainersConfig from "../data/DashboardContainersConfig";
import { useTranslation } from 'react-i18next';

// Utility function to convert container names to translation keys
const toTranslationKey = (name) => {
  return name
    .toLowerCase() // Convert to lower case: "manage user account"
    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase()); // Convert to camelCase: "manageUserAccount"
};

const Dashboard = () => {
  const { userType, setUserType } = useUser(); // Combine these into a single call
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  // Debugging: Log current userType to verify it's being set correctly
  console.log("Current userType in Dashboard Component:", userType);

  // Comment or remove this useEffect block when done testing with a hardcoded userType
  // This is only for testing and should not be used in production
  
  useEffect(() => {
    setUserType('admin');
  }, [setUserType]);

  // Retrieve the containers for the current user type
  const containers = DashboardContainersConfig[userType] || [];
  
  // Debugging: Log the containers to verify they are being set correctly
  console.log("Containers to render:", containers);
  
  // Use this function for navigating to different pages
  const handleNavigate = (route) => {
    startTransition(() => {
      navigate(route);
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow relative pt-16"> 
        <div className="absolute inset-0 z-[-1]" style={{ backgroundImage: "url('/photos/photoIndoor.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-custom-blue opacity-75"></div>
        </div>
        <div className="text-center mb-20" style={{ paddingTop: '4rem' }}>
          <h1 className="text-6xl font-bold text-white [text-shadow:0px_4px_4px_#00000040]">{t('dashboard:dashboardTitle')}</h1>
        </div>
        <div className="flex justify-center mt-8 mb-32"> 
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {containers.map(({ name, icon, route }) => (
                    <DashboardContainer
                        key={name}
                        name={t(toTranslationKey(name))} 
                        icon={icon}
                        onClick={() => handleNavigate(route)}
                    />
                ))}
            </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
