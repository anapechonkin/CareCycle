import React from "react";

const ReportTable = ({ data }) => {
  if (!Array.isArray(data) || data.length === 0) {
    return <p>No data to display.</p>;
  }

  // Define the table headers
  const headers = [
    "Newcomer Status",
    "Newcomer Comment",
    "Self Identification",
    "Primary Gender",
    "Gender Identity",
    "Custom Gender",
    "Area",
    "Map Area Name",
    "Workshop Name",
    "Year of Birth",
    "Preferred Language",
  ];

  // Styling
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
              <td style={tdStyle}>{item.newcomer_status}</td>
              <td style={tdStyle}>{item.newcomer_comment || "N/A"}</td>
              <td style={tdStyle}>{item.self_identifications ? item.self_identifications.join(', ') : 'N/A'}</td>
              <td style={tdStyle}>{item.primary_gender}</td>
              <td style={tdStyle}>{item.gender_identities ? item.gender_identities.join(', ') : 'N/A'}</td>
              <td style={tdStyle}>{item.custom_gender || "N/A"}</td>
              <td style={tdStyle}>{item.area_name}</td>
              <td style={tdStyle}>{item.map_areas ? item.map_areas.join(', ') : 'N/A'}</td>
              <td style={tdStyle}>{item.workshop_name}</td>
              <td style={tdStyle}>{item.year_of_birth}</td>
              <td style={tdStyle}>{item.language_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
