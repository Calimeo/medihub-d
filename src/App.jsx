import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Context } from "./main";

// Import des pages
import DoctorLoginPage from "./doctor/DoctorLoginPage";
import DoctorAppointmentsPage from "./doctor/DoctorAppointmentsPage";
import DoctorPatientRecordsPage from "./doctor/DoctorPatientRecordsPage";
import DoctorChatPage from "./doctor/DoctorMessagesPage";
import DoctorSchedulePage from "./doctor/DoctorSchedulePage";
import Home from "./doctor/home";
import ProfilePage from "./doctor/userProfilePage";
import DoctorPrescriptionsPage from "./doctor/DoctorPrescriptionsPage";
import API from "@/axios/axios.js";
// import InboxPage from "./doctor/inboxpage";

// Composant route protégée
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(Context);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const { isAuthenticated, setIsAuthenticated, doctor, setDoctor } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get("/api/v1/user/doctor/me", {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setDoctor(response.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setDoctor({});
      } finally {
        setLoading(false); // Important !
      }
    };

    fetchUser();
  }, [setIsAuthenticated, setDoctor]);

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto py-8 px-4 min-h-[calc(100vh-64px)]">
          <Routes>
            {/* Page d'accueil redirige vers login */}
            <Route path="/" element={<Navigate to="/doctor/home" replace />} />

            {/* Page login */}
            <Route path="/login" element={<DoctorLoginPage />} />

            {/* Routes protégées */}
            <Route path="/doctor/home" element={
              <PrivateRoute><Home /></PrivateRoute>
            } />
            <Route path="/doctor/appointment" element={
              <PrivateRoute><DoctorAppointmentsPage /></PrivateRoute>
            } />
            <Route path="/doctor/patient" element={
              <PrivateRoute><DoctorPatientRecordsPage /></PrivateRoute>
            } />
            <Route path="/doctor/message" element={
              <PrivateRoute><DoctorChatPage /></PrivateRoute>
            } />
            <Route path="/doctor/schedule" element={
              <PrivateRoute><DoctorSchedulePage  /></PrivateRoute>
            } />
            <Route path="/doctor/me" element={
              <PrivateRoute><ProfilePage  /></PrivateRoute>
            } />
             <Route path="/doctor/prescri" element={
              <PrivateRoute><DoctorPrescriptionsPage  /></PrivateRoute>
            } />
            {/* <Route path="/doctor/inbox" element={
              <PrivateRoute><InboxPage  /></PrivateRoute>
            } /> */}
            {/* Catch-all : redirection vers login si route inconnue */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
