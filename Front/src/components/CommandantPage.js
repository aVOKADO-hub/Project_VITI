
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

    // Функція для відкриття/закриття модального вікна
    const toggleModal = () => {
        setIsModalOpen(prev => !prev);
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

    const shareDocument = async () => {
        try {
            console.log("Надсилання документа...");
            const response = await fetch('../dailyOrder.doc');
            console.log("Статус відповіді:", response.status);

            const blob = await response.blob();
            console.log("Тип файлу:", blob.type);

            setSharedDocument({
                blob: blob,
                fileName: "dailyOrder.doc",
                timestamp: new Date().getTime()
            });
            console.log("Документ надіслано:", {
                blob: blob,
                fileName: "dailyOrder.doc",
                timestamp: new Date().getTime()
            });


            alert("Документ надіслано успішно");
        } catch (error) {
            console.error("Помилка надсилання документа:", error);
            alert("Невдалося відправити файл");
        }
    };


    return (
        <div className="main-layout">
            {/* Бічна панель з іконками */}
            <Sidebar toggleModal={toggleModal} />
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



            </div>
        </div>
    );

}
export default CommandantPage