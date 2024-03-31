// Example configuration for dashboard containers based on user types
const dashboardContainersConfig = {
    admin: [
      { name: "Manage User Account", icon: "/icons/userAccount.png", route: "/userAccount" },
      { name: "Client Stats Questionnaire", icon: "/icons/clientStats.png", route: "/startQuestionnaire" },
      { name: "Stats Report", icon: "/icons/clientStatsReport.png", route: "/clientStatsReport" },
      // Add more admin containers as needed
    ],
    volunteer: [
      { name: "Manage User Account", icon: "/icons/userAccount.png", route: "/userAccount" },
      { name: "Client Stats Questionnaire", icon: "/icons/clientStats.png", route: "/startQuestionnaire" },
      // Add more volunteer containers as needed
    ],
    'ca/employee': [
      { name: "Manage User Account", icon: "/icons/userAccount.png", route: "/userAccount" },
      { name: "Client Stats Questionnaire", icon: "/icons/clientStats.png", route: "/startQuestionnaire" },
      { name: "Stats Report", icon: "/icons/clientStatsReport.png", route: "/clientStatsReport" },
      // Add more employee containers as needed
    ],
    // Add other user types as needed
  };
  
  export default dashboardContainersConfig;
  