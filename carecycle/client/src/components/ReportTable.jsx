import React from "react";
import { useTranslation } from "react-i18next";

const ReportTable = ({ data }) => {
  // Use 'reportTable' namespace for both headers and data translation
  const { t } = useTranslation('reportTable', 'clientStatsReportForm', 'pageOneQuestionnaire');

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
  };

  const thStyle = {
    backgroundColor: "#0f6a8b",
    color: "white",
    textAlign: "left",
    padding: "8px",
    borderBottom: "2px solid #ddd",
  };

  const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
  };

  const tableContainerStyle = {
    backgroundColor: "white",
    overflowX: "auto",
    margin: "20px 0",
  };

  // Headers translation using 'reportTable' namespace
  const headers = [
    t("reportTable:headers.Newcomer Status"),
    t("reportTable:headers.Self-Identification"),
    t("reportTable:headers.Primary Gender"),
    t("reportTable:headers.Gender Identity"),
    t("reportTable:headers.Area"),
    t("reportTable:headers.Map Region"),
    t("reportTable:headers.Workshop"),
    t("reportTable:headers.Year of Birth"),
    t("reportTable:headers.Preferred Language"),
  ];

 // Function to translate data dynamically
const translateData = (namespace, key, value) => t(`${namespace}:${key}.${value}`, value);

  return (
    <div style={tableContainerStyle}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={thStyle}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {/* Translations for data using keys from 'reportTable' */}
              <td style={tdStyle}>{translateData("clientStatsReportForm", "newcomerStatus.options", item.newcomer_status)}</td>
              <td style={tdStyle}>{item.self_identifications ? item.self_identifications.map(id => translateData("clientStatsReportForm", "selfIdentification.options", id)).join(", ") : t("n/a")}</td>
              <td style={tdStyle}>{translateData("clientStatsReportForm", "primaryGenders.options", item.primary_gender)}</td>
              <td style={tdStyle}>{item.gender_identities ? item.gender_identities.map(gender => translateData("clientStatsReportForm", "genderIdentities.options", gender)).join(", ") : t("n/a")}</td>
              <td style={tdStyle}>{item.area_name ? translateData("clientStatsReportForm", "postalCodeAreas.options", item.area_name) : t("n/a")}</td>
              <td style={tdStyle}>{item.map_areas ? item.map_areas.map(area => translateData("clientStatsReportForm", "placeOfOrigin.options", area)).join(", ") : t("n/a")}</td>
              <td style={tdStyle}>{translateData("clientStatsReportForm", "workshopActivityTypes.options", item.workshop_name)}</td>
              <td style={tdStyle}>{item.year_of_birth}</td>
              <td style={tdStyle}>{translateData("pageOneQuestionnaire", "languages", item.language_name)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
