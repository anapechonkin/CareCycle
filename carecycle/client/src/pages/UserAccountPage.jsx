import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import UserAccountForm from "../components/UserAccountForm"; // Make sure to create this component
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";


const UserAccountPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
        <div className="absolute inset-0 z-[-1]" style={{ backgroundImage: "url('/photos/photoIndoor.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0 bg-custom-blue opacity-75"></div>
        </div>
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12">
          <h1 className="text-5xl font-bold mb-16 text-center text-gray-800 [text-shadow:0px_4px_4px_#00000040]">For Admin Use Only</h1>
          <UserAccountForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAccountPage;
