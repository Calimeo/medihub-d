import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "@/axios/axios.js";

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/api/v1/appoitment/rdv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/api/v1/appoitment/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Statut mis à jour");
      fetchAppointments(); // Recharge la liste
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">Mes Rendez-vous</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Chargement en cours...</p>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 text-center">Aucun rendez-vous trouvé.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appt) => (
            <div
              key={appt._id}
              className="bg-white shadow-md rounded-lg p-5 border hover:shadow-lg transition duration-200"
            >
              <div className="mb-3">
                <p className="text-gray-700">
                  <span className="font-semibold">Patient:</span> {appt.patient?.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(appt.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Heure:</span>{" "}
                  {new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Raison:</span> {appt.reason}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Statut:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      appt.status === "accepted"
                        ? "bg-green-500"
                        : appt.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {appt.status}
                  </span>
                </p>
              </div>

              {appt.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(appt._id, "accepted")}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Accepter
                  </button>
                  <button
                    onClick={() => handleStatusChange(appt._id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;
