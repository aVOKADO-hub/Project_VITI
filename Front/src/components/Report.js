import React, { useState, useEffect } from "react";

const Report = ({ reportRef }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reports", {
          credentials: 'include' 
        });
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Unable to fetch reports. Please try again later.");
      }
    };

    fetchReports();
  }, []);

  const handleReportClick = async (reportId) => {
    setSelectedReport(reportId);

    try {
      const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
        credentials: 'include' 
      });
      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }
      const data = await response.json();
      setReportDetails(data.description);
    } catch (error) {
      console.error("Error fetching report details:", error);
      setError("Unable to fetch report details. Please try again later.");
    }
  };

  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reports-wrapper">
      <div className="search-input-container"> 
      <input
        type="text"
        placeholder="Пошук доповіді..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input" 
        />
        <h2>Доповіді</h2>
    </div>
      <div className="reports-container">
        
        <div className="reports">
        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <ul>
  {filteredReports.map((report) => (
    <li
      key={report.id}
      onClick={() => handleReportClick(report.id)}
      ref={report.id === 2 ? reportRef : null} 
      className={selectedReport === report.id ? "selected" : ""}
    >
      {report.reportName} - {report.toWhom}
    </li>
  ))}
</ul>

        )}
      </div>

      <div className="reports-details">
        {reportDetails ? (
          <p>{reportDetails}</p>
        ) : (
          <p>Оберіть доповідь.</p>
        )}
      </div>
      </div>
    </div>
  );
};

export default Report;