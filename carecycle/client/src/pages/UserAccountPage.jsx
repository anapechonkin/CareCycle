import React, { useState, useEffect } from "react";
import Banner from "../components/Banner";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Shadow from "../components/Shadow";
import TabComponent from "../components/Tab"; 
import AddUserForm from "../components/AddUserForm";
import UpdateUserForm from "../components/UpdateUserForm";
import DeleteUserForm from "../components/DeleteUserForm";
import { getUsers } from '../api/userApi';
import { useTranslation } from 'react-i18next';

const UserAccountPage = () => {
  const [activeTab, setActiveTab] = useState('add');
  const [users, setUsers] = useState([]);
  const { t } = useTranslation('userManagement');

  // Fetch the list of users on component mount and whenever needed
  const refreshUsersList = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  useEffect(() => {
    refreshUsersList();
  }, []);

  // Define the tabs and their corresponding components
  const tabs = [
    { id: 'add', name: t('userManagement:tabs.add') },
    { id: 'update', name: t('userManagement:tabs.update') },
    { id: 'archive', name: t('userManagement:tabs.archive') }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      <div className="pt-20 pb-20 flex-grow flex flex-col items-center justify-center" style={{ marginTop: '100px' }}>
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-5xl font-bold mb-12 text-center text-black opacity-85 [text-shadow:0px_4px_4px_#00000040]">{t('userManagement:pageTitle')}</h1>
          <TabComponent
            tabs={tabs.map(tab => ({ id: tab.id, name: tab.name }))}
            currentTab={activeTab}
            setCurrentTab={setActiveTab}
          />
          <div className={activeTab !== 'add' ? 'hidden' : ''}>
            <AddUserForm onAddUser={refreshUsersList} />
          </div>
          <div className={activeTab !== 'update' ? 'hidden' : ''}>
            {/* Pass the refreshUsersList and users to UpdateUserForm */}
            <UpdateUserForm onAddUser={refreshUsersList} users={users} />
          </div>
          <div className={activeTab !== 'archive' ? 'hidden' : ''}>
            <DeleteUserForm onUsersChanged={refreshUsersList}/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccountPage;
