"use client";

import React from "react";

interface GoogleCalendarProps {
  calendarUrl: string;
}

const GoogleCalendar: React.FC<GoogleCalendarProps> = ({ calendarUrl }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl text-center mb-6">
        Book Your Strategy Session
      </h2>
      <div className="relative" style={{ paddingBottom: "75%", height: 0 }}>
        <iframe
          src={calendarUrl}
          style={{
            borderWidth: 0,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleCalendar;
