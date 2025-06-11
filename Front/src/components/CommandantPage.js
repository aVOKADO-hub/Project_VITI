import { useState, useEffect } from "react";
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import DocumentForm from "./Documents/DocumentForm";
import Sidebar from "./Sidebar";
import { useEventTimer } from '../hooks/useEventTimer'; // Імпортуємо наш хук
import { apiService } from '../api/apiService'; // Імпортуємо API сервіс

function CommandantPage({ events }) { // Тепер компонент приймає лише 'events'
    // Використовуємо хук для всієї логіки, пов'язаної з таймером
    const { timeLeft, currentEventIndex } = useEventTimer(events);

    // Логіка, специфічна для цієї сторінки, залишається тут
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [reportNotifications, setReportNotifications] = useState([]);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            // Використовуємо apiService для запиту
            const data = await apiService.getReports();
            setReports(data);
        } catch (error) {
            console.error("Error fetching reports:", error);
            setError("Unable to fetch reports. Please try again later.");
        }
    };

    useEffect(() => {
        fetchReports();
        const intervalId = setInterval(fetchReports, 5 * 60 * 1000); // 5 хвилин
        return () => clearInterval(intervalId);
    }, []);

    const parseTime = (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    };

    useEffect(() => {
        if (reports.length > 0) {
            const now = new Date();
            const newNotifications = reports
                .filter((report) => !report.done && parseTime(report.reportName) < now)
                .map((report) => `Доповідь "${report.reportName}" не виконана!`);
            setReportNotifications(newNotifications);
        }
    }, [reports]);

    const toggleModal = () => setIsModalOpen(prev => !prev);
    const toggleReportsModal = () => setIsReportsModalOpen(prev => !prev);

    // ВЕСЬ СТАРИЙ КОД З `calculateTimeLeft` ТА `useEffect` ДЛЯ ТАЙМЕРА ВИДАЛЕНО

    return (
        <div className="main-layout">
            <Sidebar toggleModal={toggleModal} toggleReportsModal={toggleReportsModal} reportNotifications={reportNotifications} />
            <div className=" wrapper">
                <div className="left-section">
                    <KyivTime />
                </div>
                <div className="navbar-section">
                    <Navbar
                        events={events}
                        currentEventIndex={currentEventIndex}
                        timeLeft={timeLeft}
                    />
                </div>
                <div className="schedule-section">
                    <Schedule
                        events={events}
                        currentEventIndex={currentEventIndex}
                    />
                </div>

                {isModalOpen && (
                    <div className="modal-overlay" onClick={toggleModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={toggleModal}>&times;</button>
                            <DocumentForm />
                        </div>
                    </div>
                )}
                {isReportsModalOpen && (
                    <div className="modal-overlay" onClick={toggleReportsModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={toggleReportsModal}>&times;</button>
                            {reportNotifications.length > 0 && (
                                <div className="report-notifications">
                                    {reportNotifications.map((notification, index) => (
                                        <p key={index}>{notification}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommandantPage;