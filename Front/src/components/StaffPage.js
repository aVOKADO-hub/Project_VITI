import KyivTime from './KyivTime';
import Navbar from "./Navbar";
import Schedule from './Schedule';
import { useEventTimer } from '../hooks/useEventTimer'; // Імпортуємо наш хук

// Коментарі до невикористовуваних імпортів можна видалити
// import Report from "./Report"; 
// import Instruction from './Instruction';

function StaffPage({ events }) {
    // Вся логіка таймера тепер інкапсульована в хуці
    const { timeLeft, currentEventIndex } = useEventTimer(events);

    // Функція calculateTimeLeft та громіздкий useEffect для таймера видалені

    return (
        <div className="container">
            <div className="left-section">
                <KyivTime /> {/* Display Kyiv time here */}
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

            {/* Закоментовані секції залишаються без змін */}
            {/* <div className="reports-section">
                <Report reportRef={reportRef} />
            </div>
            <div className="instructions-section">
                <Instruction />
            </div> */}
        </div>
    );
}

export default StaffPage;