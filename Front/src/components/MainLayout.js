
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import Report from "./Report";
import Instruction from './Instruction';
import DocumentsTable from "./Documents/DocumentsTable";
import Sidebar from "./Sidebar";




function MainLayout({ events, currentEventIndex, timeLeft, reportRef, alertTriggered, setAlertTriggered, setCurrentEventIndex, setTimeLeft }) {
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false); // Стан для модального вікна

    // Функція для відкриття/закриття модального вікна
    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
    };
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
    }, [events, currentEventIndex, alertTriggered, location.pathname, setTimeLeft]);
    return (
        <div className="main-layout">
            {/* Бічна панель з іконками */}
            <Sidebar toggleModal={toggleModal} />

            <div className="wrapper">
                <div className="left-section">
                    <KyivTime />
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
                <div className="reports-section">
                    <Report reportRef={reportRef} />
                </div>
                <div className="instructions-section">
                    <Instruction />
                </div>
            </div>

            {/* Модальне вікно для DocumentsTable */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={toggleModal}>
                            &times;
                        </button>
                        <DocumentsTable />
                    </div>
                </div>
            )}
        </div>
    );
}
export default MainLayout