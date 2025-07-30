// doctor/DoctorSchedulePage.jsx
import React, { useState, useEffect } from "react";

const initialAvailability = {
  // weekday: array of hour blocks (24h format strings)
  Monday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
  Tuesday: ["09:00", "10:00", "11:00", "14:00", "15:00"],
  Wednesday: ["09:00", "10:00", "11:00"],
  Thursday: ["14:00", "15:00", "16:00"],
  Friday: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
};

const weekDaysFr = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const backendDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// We will map French days to backend days.

export default function DoctorSchedulePage() {
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    // Load availability (dummy)
    setAvailability(initialAvailability);
  }, []);

  function toggleSlot(dayBackend, time) {
    setAvailability((prev) => {
      const daySlots = prev[dayBackend] || [];
      if (daySlots.includes(time)) {
        return {
          ...prev,
          [dayBackend]: daySlots.filter((t) => t !== time),
        };
      } else {
        return {
          ...prev,
          [dayBackend]: [...daySlots, time].sort(),
        };
      }
    });
  }

  // Generate time slots 8:00 to 18:00 by 30m intervals (only hour slots for simplicity here)
  const timeSlots = [];
  for (let h = 8; h <= 18; h++) {
    timeSlots.push(h.toString().padStart(2, "0") + ":00");
    timeSlots.push(h.toString().padStart(2, "0") + ":30");
  }

  // Map French day to backend to show labels properly
  const dayMap = {};
  weekDaysFr.forEach((fr, i) => (dayMap[backendDays[i]] = fr));

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">
        Gérer mes disponibilités
      </h2>
      <p className="text-center text-gray-700 mb-8">
        Cliquez sur une case horaire pour activer/désactiver votre disponibilité.
      </p>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="border border-gray-300 px-4 py-2">Horaires</th>
              {backendDays.slice(0, 5).map((day) => (
                <th key={day} className="border border-gray-300 px-4 py-2">
                  {dayMap[day]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((slot) => (
              <tr key={slot} className="select-none">
                <td className="border border-gray-300 px-3 py-1 text-xs font-mono">
                  {slot}
                </td>
                {backendDays.slice(0, 5).map((day) => {
                  const isAvailable =
                    availability[day] && availability[day].includes(slot);
                  return (
                    <td
                      key={day + slot}
                      className={`border border-gray-300 cursor-pointer px-3 py-1 flex justify-center items-center transition ${
                        isAvailable
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-white hover:bg-green-100"
                      }`}
                      onClick={() => toggleSlot(day, slot)}
                      aria-pressed={isAvailable}
                      role="checkbox"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          toggleSlot(day, slot);
                        }
                      }}
                      title={`Disponibilité ${dayMap[day]} à ${slot}`}
                    >
                      {isAvailable ? "✔" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}