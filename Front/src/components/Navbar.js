import React from "react";

const Navbar = ({ events, currentEventIndex, timeLeft, triggerReportClick }) => {
  return (
    <div className="navbar">
      {events.length > 0 ? (
        <div>
          <h2>{events[currentEventIndex].eventName}</h2>
          <div>
            {timeLeft.hours} год. {timeLeft.minutes} хв. {timeLeft.seconds} с.
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Navbar;
