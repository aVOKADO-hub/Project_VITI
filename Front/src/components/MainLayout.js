
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import Report from "./Report";
import Instruction from './Instruction';
import { saveAs } from 'file-saver';


function MainLayout({ events,
    currentEventIndex,
    timeLeft,
    reportRef,
    alertTriggered,
    setAlertTriggered,
    setCurrentEventIndex,
    setTimeLeft,
    sharedDocument }) {
    const location = useLocation();
    const [receivedDocument, setReceivedDocument] = useState(null);

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
    // Перший useEffect для таймера подій
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

    // Другий useEffect для обробки отриманого документа
    // useEffect(() => {
    //     console.log("Зміна sharedDocument:", sharedDocument);
    // }, [sharedDocument]);

    return (
        <div className="wrapper">
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
            <div className="reports-section">
                <Report reportRef={reportRef} />
            </div>
            <div className="instructions-section">
                <Instruction />
            </div>
            {receivedDocument && (
                <div className="shared-document-section bg-gray-100 p-4 rounded-lg shadow-md">
                    <h3>Отриманий документ</h3>
                    <p>Назва файлу: {receivedDocument.fileName}</p>
                    <p>Отримано о: {new Date(receivedDocument.timestamp).toLocaleString()}</p>
                    <button
                        onClick={() => {
                            try {
                                saveAs(receivedDocument.blob, receivedDocument.fileName);
                            } catch (error) {
                                console.error("Помилка завантаження:", error);
                                alert("Не вдалося завантажити документ");
                            }
                        }}
                    >
                        Завантажити документ
                    </button>
                </div>
            )}
        </div>
    );

}
export default MainLayout