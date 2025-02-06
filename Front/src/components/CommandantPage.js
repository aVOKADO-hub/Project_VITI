
import { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import Report from "./Report";
// import Instruction from './Instruction';
import dailyOrderFile from '../dailyOrder.doc';
import { saveAs } from 'file-saver';


function CommandantPage({ events, currentEventIndex, timeLeft, reportRef, alertTriggered, setAlertTriggered, setCurrentEventIndex, setTimeLeft,
    setSharedDocument }) {
    const location = useLocation();


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
            {/* <div className="reports-section">
                <Report reportRef={reportRef} />
            </div>
            <div className="instructions-section">
                <Instruction />
            </div> */}
            <div class="accordion" id="documentAccordion">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            Відправка документів
                        </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#documentAccordion">
                        <div class="accordion-body">
                            <form class="p-4 border rounded shadow-lg">
                                <legend class="mb-4 text-center">Відправити документ</legend>

                                <div class="mb-3">
                                    <label for="docType" class="form-label">Тип документа</label>
                                    <select id="docType" class="form-select">
                                        <option value="" disabled selected>Оберіть тип документа</option>
                                        <option value="dailyOrder">Добовий наказ</option>
                                        <option value="rozkhid">Розход</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="receiverRole" class="form-label">Отримувач</label>
                                    <select id="receiverRole" class="form-select">
                                        <option value="" disabled selected>Оберіть отримувача</option>
                                        <option value="dutyOfficer">Черговий інституту</option>
                                        <option value="ChiefOfStaff">Начальник штабу</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label for="fileUpload" class="form-label">Завантажити документ</label>
                                    <input type="file" id="fileUpload" class="form-control"></input>
                                </div>

                                <button type="button" class="btn btn-primary w-100" onClick="shareDocument()">Надіслати документ</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>




        </div>
    );

}
export default CommandantPage