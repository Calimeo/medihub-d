import React, { useEffect, useState } from "react";
import axios from "axios";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Aucun token trouvé. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }

    const userRes = await API.get("/api/v1/user/doctor/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const doctorId = userRes.data.user._id;
    console.log("doctorId:", doctorId); // debug

    const appointmentsRes = await API.get(
      `/api/v1/appoitment/rdv/${doctorId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setAppointments(appointmentsRes.data.appointments || []);
  } catch (err) {
    toast.error(
      err.response?.data?.message || "Erreur lors du chargement des rendez-vous."
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-emerald-700 text-center">Mes Rendez-vous</h1>

      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : appointments.length === 0 ? (
        <p className="text-center text-gray-500 italic">Aucun rendez-vous trouvé.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="p-5 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3 mb-2">
                <CalendarDaysIcon className="w-6 h-6 text-blue-500" />
                <span className="text-lg font-semibold text-gray-800">
                  {new Date(appt.appointment_date || appt.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">
                <span className="font-medium">Nom du patient :</span>{" "}
                {appt.patientFirstName || appt.firstName} {appt.patientLastName || appt.lastName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email :</span> {appt.patientEmail || appt.email}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Département :</span> {appt.department || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Adresse :</span> {appt.patientAddress || appt.address}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
