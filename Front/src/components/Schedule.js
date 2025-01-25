import React, { useState } from "react";

const Schedule = ({ events, currentEventIndex }) => {
  const [notes, setNotes] = useState([
    { id: 1, text: "Доповідь про прийняття наряду" },
    { id: 2, text: "Перевірка КЗЗ" },
  ]);
  const [newNote, setNewNote] = useState("");

  const getCurrentDate = () => {
    const now = new Date();
    const options = {
      month: "long",
      day: "numeric",
      year: "numeric",
    };
    return now.toLocaleDateString("ukr", options).toUpperCase();
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const noteToAdd = { id: Date.now(), text: newNote };
      setNotes((prevNotes) => [...prevNotes, noteToAdd]);
      setNewNote(""); // Clear input field
    }
  };

  const handleNoteCheck = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // Create variables to avoid repetition
  const currentIndex = currentEventIndex - 1;
  const previousIndex = currentEventIndex - 2;

  return (
    <div className="schedule-container">
      <div className="middle-panel">
        <h2>{getCurrentDate()}</h2>
        <div className="task-list">
          {events.length === 0 ? (
            <p>Loading tasks...</p>
          ) : (
            events.map((task, index) => (
              <div
                key={index}
                className={`task-item ${
                  index === currentIndex
                    ? "current-task"
                    : index === previousIndex
                    ? "previous-task" 
                    : ""
                }`}
              >
                <span>{task.eventName}</span>
                <span>{task.eventTime}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="right-panel">
        <h3>Нотатки</h3>
        <div className="notes">
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <input
                type="checkbox"
                onChange={() => handleNoteCheck(note.id)}
              />
              <span>{note.text}</span>
            </div>
          ))}
        </div>
        <div className="notes-create">
          <input
            type="text"
            placeholder="Додайте нотатку..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <button id="notes-create-btn" onClick={handleAddNote}>
            Додати нотатку
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
