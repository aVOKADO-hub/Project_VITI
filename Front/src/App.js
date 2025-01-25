import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginAdminPanel from './components/LoginAdminPanel'
import AdminPanel from './components/AdminPanel';
import KyivTime from './components/KyivTime';
import Navbar from "./components/Navbar";
import Schedule from './components/Schedule';
import Report from "./components/Report";
import Instruction from './components/Instruction';
import './App.css';
import { useRef, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

function App() {
  const reportRef = useRef(null); 
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});
  const [alertTriggered, setAlertTriggered] = useState(false);

  // Fetch events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainLayout 
              events={events} 
              currentEventIndex={currentEventIndex} 
              timeLeft={timeLeft} 
              reportRef={reportRef} 
              alertTriggered={alertTriggered} 
              setAlertTriggered={setAlertTriggered}
              setCurrentEventIndex={setCurrentEventIndex} 
              setTimeLeft={setTimeLeft}  // Pass setTimeLeft here
            />
          } 
        />
        <Route path="/admin" element={<LoginAdminPanel />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

function MainLayout({ events, currentEventIndex, timeLeft, reportRef, alertTriggered, setAlertTriggered, setCurrentEventIndex, setTimeLeft }) {
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
          alert(`Провести перевірку події: ${currentEvent.eventName}`);
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
    <div className="container">
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
    </div>
  );

}

export default App;
