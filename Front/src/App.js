import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPanel from './components/LoginPanel'
import AdminPanel from './components/AdminPanel';
import './App.css';
import { useRef, useState, useEffect } from "react";
import MainLayout from './components/MainLayout'
import CommandantPage from './components/CommandantPage';
import StaffPage from './components/StaffPage';

function App() {
  const reportRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({});
  const [alertTriggered, setAlertTriggered] = useState(false);
  const [sharedDocument, setSharedDocument] = useState(null);

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
          path="/dutyOfficer" // ЧІ
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
              sharedDocument={sharedDocument}
              setSharedDocument={setSharedDocument}
            />
          }
        />
        <Route
          path="/staffOfficer"// ВООС - начальник штабу
          element={
            <StaffPage
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
        <Route
          path="/сommandantOfficer"// комендант
          element={
            <CommandantPage
              events={events}
              currentEventIndex={currentEventIndex}
              timeLeft={timeLeft}
              reportRef={reportRef}
              alertTriggered={alertTriggered}
              setAlertTriggered={setAlertTriggered}
              setCurrentEventIndex={setCurrentEventIndex}
              setTimeLeft={setTimeLeft}  // Pass setTimeLeft here
              setSharedDocument={setSharedDocument}
            />
          }
        />
        <Route path="/admin" element={<LoginPanel />} />
        <Route path="/adminPanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}



export default App;
