import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // Load translations over http
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next.
  .init({
    fallbackLng: 'en', // Use English if the detected language is not available
    debug: true, // Set to false in production
    ns: [
      'navbar',
      'footer',
      'dashboard',
      'loginForm',
      'startQuestionnaire',
      'pageOneQuestionnaire',
      'pageTwoQuestionnaire', 
      'pageGenderIdentities',
      'pageThreeQuestionnaire',
      'pageFourQuestionnaire',
      'userManagement',
      'addUserForm',
      'deleteUserForm',
      'reportPage',
      'clientStatsReportForm',
      'reportTable',
    ], // Namespace used, you can add more namespaces here
    defaultNS: 'navbar',
    backend: {
      loadPath: '/internationalization/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
  });

export default i18n;
