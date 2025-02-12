import React, { useState, useEffect, loading } from "react";
import useAuthenticatedRequest from "./AuthenticatedRequest/useAuthenticatedRequest";


const Report = ({ reportRef }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const token = localStorage.getItem('authToken')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/reports", {
          credentials: 'include',
          headers: {
            "Authorization": `Bearer ${token}`,
          }
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
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }

      const data = await response.json();
      setReportDetails(data.description);
    } catch (error) {
      console.error("Error fetching report details:", error);
      setReportDetails("Помилка при завантаженні деталей доповіді");
    }
  };

  const filteredReports = reports.filter((report) =>
    report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return <div>Завантаження...</div>;
  }

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
            <p>Оберіть доповідь для перегляду деталей</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;