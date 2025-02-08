import React, { useState } from "react";
import useAuthenticatedRequest from "./AuthenticatedRequest/useAuthenticatedRequest";

const Report = ({ reportRef }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Используем кастомный хук для получения отчетов
  const { data: reports = [], error, loading } = useAuthenticatedRequest('http://localhost:8080/api/reports');

  const handleReportClick = async (reportId) => {
    setSelectedReport(reportId);

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/api/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

  // Фильтрация отчетов с проверкой на существование reports
  const filteredReports = reports?.filter((report) =>
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
            <p className="error-message">Помилка завантаження доповідей: {error}</p>
          ) : (
            filteredReports.length > 0 ? (
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
            ) : (
              <p>Доповіді не знайдено</p>
            )
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