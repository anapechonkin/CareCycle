import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import DashboardContainer from "../components/DashboardContainer";
import DashboardContainersConfig from "../data/DashboardContainersConfig";

const Dashboard = () => {
  const { userType, setUserType } = useUser(); // Combine these into a single call

  // Debugging: Log current userType to verify it's being set correctly
  console.log("Current userType in Dashboard Component:", userType);

  // Comment or remove this useEffect block when done testing with a hardcoded userType
  // This is only for testing and should not be used in production
  
  useEffect(() => {
    setUserType('admin');
  }, [setUserType]);

  // Retrieve the containers for the current user type
  const containers = DashboardContainersConfig[userType] || [];
  
  // Correct place for the log statement
  console.log("Containers to render:", containers);
  
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow relative">
        <div className="absolute inset-0 z-[-1]" style={{ backgroundImage: "url('/photos/photoIndoor.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-custom-blue opacity-75"></div>
        </div>
        <div className="flex justify-center pt-24 mt-8 mb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {containers.map(({ name, icon, route }) => (
                    <DashboardContainer
                        key={name}
                        name={name}
                        icon={icon}
                        onClick={() => navigate(route)}
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
