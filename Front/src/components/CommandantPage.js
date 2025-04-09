
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import Report from "./Report";
import DocumentForm from "./Documents/DocumentForm";

import Sidebar from "./Sidebar";


function CommandantPage({ events, currentEventIndex, timeLeft, reportRef, alertTriggered, setAlertTriggered, setCurrentEventIndex, setTimeLeft,
    setSharedDocument }) {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false); // Стан для модального вікна
    const [isReportsModalOpen, setIsReportsModalOpen] = useState(false); // Стан для модального вікна
    const [reports, setReports] = useState([]); // Додано стан для reports
    const [reportNotifications, setReportNotifications] = useState([]);
    const token = localStorage.getItem('authToken');
    const [error, setError] = useState(null);

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
            console.log(`fetch data: ${JSON.stringify(data)}`)
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
        const reportTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        return reportTime;
    };

    useEffect(() => {
        if (reports.length > 0) {
            const now = new Date();
            console.log(`now: ${now}`)
            console.log(`report list: ${JSON.stringify(reports)}`)
            const newNotifications = reports
                .filter((report) => !report.done)
                .filter((report) => {
                    const reportTime = parseTime(report.reportName);
                    return reportTime < now;
                })
                .map((report) => `Доповідь "${report.reportName}" не виконана!`);

            setReportNotifications(newNotifications);
            console.log(`new notif: ${JSON.stringify(newNotifications)}`)
        }
    }, [reports]);

    // Функція для відкриття/закриття модального вікна
    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
    };
    const toggleReportsModal = () => {
        setIsReportsModalOpen(prev => !prev);
    };
    // Calculate time left for the current event
    const calculateTimeLeft = (eventTime) => {
        const now = new Date();
        const eventDate = new Date(`${now.toISOString().split("T")[0]}T${eventTime}`);
        const difference = eventDate - now;

        if (difference > 0) {
            return {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                totalMilliseconds: difference,
            };
        } else {
            return { hours: 0, minutes: 0, seconds: 0, totalMilliseconds: 0 };
        }
    };

    // Timer logic to check current event and trigger alerts, only if not in /admin
    useEffect(() => {
        const timer = setInterval(() => {
            if (events.length > 0 && location.pathname !== "/admin") {
                const currentEvent = events[currentEventIndex];
                const newTimeLeft = calculateTimeLeft(currentEvent.eventTime);
                setTimeLeft(newTimeLeft);

                if (newTimeLeft.totalMilliseconds <= 600000 && !alertTriggered) {
                    // alert(`Провести перевірку події: ${currentEvent.eventName}`);
                    setAlertTriggered(true);
                }

                if (newTimeLeft.totalMilliseconds <= 0 && currentEventIndex < events.length - 1) {
                    setAlertTriggered(false);
                    setCurrentEventIndex((prevIndex) => prevIndex + 1);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [events, currentEventIndex, alertTriggered, location.pathname, setTimeLeft]); // Make sure setTimeLeft is included in the dependency array



    return (
        <div className="main-layout">
            {/* Бічна панель з іконками */}
            <Sidebar toggleModal={toggleModal} toggleReportsModal={toggleReportsModal} reportNotifications={reportNotifications} />
            <div className=" wrapper">
                <div className="left-section">
                    <KyivTime /> {/* Display Kyiv time here */}
                </div>
                <div className="navbar-section">
                    <Navbar
                        events={events}
                        currentEventIndex={currentEventIndex}
                        timeLeft={timeLeft}
                        triggerReportClick={() => console.log("Report Triggered")}
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
                            <button className="close-btn" onClick={toggleModal}>
                                &times;
                            </button>
                            <DocumentForm />
                        </div>
                    </div>
                )}
                {isReportsModalOpen && (
                    <div className="modal-overlay" onClick={toggleReportsModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={toggleReportsModal}>
                                &times;
                            </button>
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
export default CommandantPage