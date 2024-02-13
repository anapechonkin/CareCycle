// Example configuration for dashboard containers based on user types
const dashboardContainersConfig = {
    admin: [
      { name: "Manage User Account", icon: "/icons/userAccount.png", route: "/userAccount" },
      { name: "Client Stats Questionnaire", icon: "/icons/clientStats.png", route: "/startQuestionnaire" },
      { name: "Client Stats Report", icon: "/icons/clientStatsReport.png", route: "/clientStatsReport" },
      // Add more admin containers as needed
    ],
    volunteer: [
      { name: "View Schedule", icon: "/icons/view_schedule.png", route: "/view-schedule" },
      { name: "Submit Time Off", icon: "/icons/time_off.png", route: "/time-off" },
      // Add more volunteer containers as needed
    ],
    'ca/employee': [
      { name: "View Schedule", icon: "/icons/view_schedule.png", route: "/view-schedule" },
      { name: "Submit Time Off", icon: "/icons/time_off.png", route: "/time-off" },
      // Add more employee containers as needed
    ],
    // Add other user types as needed
  };
  
  export default dashboardContainersConfig;
  