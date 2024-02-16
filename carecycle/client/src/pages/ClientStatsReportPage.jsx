import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import StatsReportForm from "../components/StatsReportForm";
import TabComponent from "../components/Tab";

const ClientStatsReportPage = () => {
  const [activeTab, setActiveTab] = useState('ClientStatsReport');

  // Define tabs array before using it
  const tabs = [
    { id: 'ClientStatsReport', name: 'Client Stats', headerTitle: 'Client reports focus on individual engagement metrics.', component: StatsReportForm },
    { id: 'VolunteerStatsReport', name: 'Volunteer Stats', headerTitle: 'Volunteer reports include participation and activity levels.', component: StatsReportForm }, 
    { id: 'VolunteerAttendance', name: 'Volunteer Attendance', headerTitle: 'Coming soon...', component: () => <div>Coming soon. Stay tuned for volunteer attendance tracking!</div> } // Placeholder for future development
  ];

  // Determine the active component based on the activeTab state
  const activeTabInfo = tabs.find(tab => tab.id === activeTab);
  
  // You can now determine the headerTitle based on the active tab
  const headerTitle = activeTabInfo ? activeTabInfo.headerTitle : 'Stats Report';

  // Dynamically generate the active component
  const ActiveComponent = activeTabInfo ? activeTabInfo.component : null;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="pt-20 pb-20 flex-grow flex flex-col items-center justify-center w-full" style={{ marginTop: '4rem' }}>
        <h1 className="text-5xl font-bold mb-12 mt-12 text-center text-black opacity-85 [text-shadow:0px_4px_4px_#00000040]">Statistics</h1>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 opacity-85 [text-shadow:0px_4px_4px_#00000040]">Please Choose From Filters to Generate Report</h2>
        <TabComponent
          tabs={tabs.map(tab => ({ id: tab.id, name: tab.name }))}
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
        />
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          {ActiveComponent && <ActiveComponent headerTitle={headerTitle} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientStatsReportPage;