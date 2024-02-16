import React, { useState } from "react";
import Banner from "../components/Banner";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Shadow from "../components/Shadow";
import TabComponent from "../components/Tab"; 
import AddUserForm from "../components/AddUserForm";
import UpdateUserForm from "../components/UpdateUserForm";
import DeleteUserForm from "../components/DeleteUserForm";

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState('add');

  // Define the tabs and their corresponding components
  const tabs = [
    { id: 'add', name: 'ADD', component: <AddUserForm /> },
    { id: 'update', name: 'UPDATE', component: <UpdateUserForm /> },
    { id: 'delete', name: 'DELETE', component: <DeleteUserForm /> }
  ];

  // Find the active component based on the activeTab state
  const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="pt-20 pb-20 flex-grow flex flex-col items-center justify-center" style={{ marginTop: '100px' }}>
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
        <h1 className="text-5xl font-bold mb-12 text-center text-black opacity-85 [text-shadow:0px_4px_4px_#00000040]">Manage User Account</h1>
          <TabComponent
            tabs={tabs.map(tab => ({ id: tab.id, name: tab.name }))}
            currentTab={activeTab}
            setCurrentTab={setActiveTab}
          />
          {activeComponent}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccountPage;
