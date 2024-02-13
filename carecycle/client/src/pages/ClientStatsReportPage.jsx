import React from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Shadow from "../components/Shadow";
import Footer from "../components/Footer";
import StatsReportForm from "../components/StatsReportForm";


const ClientStatsReportPage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-[#f6cdd0]">
      <NavBar />
      <Banner />
      <Shadow />
      {/* Container div that centralizes and limits content width */}
      <div className="flex-grow pt-20 pb-20 mt-24 flex flex-col items-center justify-center w-full">
        <div className="max-w-[800px] w-full px-4 lg:px-8 space-y-12"> {/* Adjust max-width as needed */}
        <h1 className="text-4xl font-bold mb-12 text-center text-[#704218] [text-shadow:0px_4px_4px_#00000040]">Client Stats Report</h1>
          <h2 className="text-3xl font-bold mb-8 text-center text-[#8D5E32] [text-shadow:0px_4px_4px_#00000040]">Please Choose From Filters to Generate Report</h2>
          <StatsReportForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientStatsReportPage;
