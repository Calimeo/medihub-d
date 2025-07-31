import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";
import { io } from "socket.io-client";
import API from "@/axios/axios.js";


const socket = io("https://backend-medilink-eub1.onrender.com", {
  withCredentials: true,
});

const DoctorChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  // 👉 Charger les utilisateurs avec lesquels le médecin a discuté
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await API.get("/api/v1/conversations", {
          withCredentials: true,
        });
        setConversations(res.data.users);
      } catch (err) {
        console.error("Erreur chargement des conversations :", err);
      }
    };

    fetchConversations();
  }, []);

  // 👉 Récupérer les messages avec l'utilisateur sélectionné
  const fetchMessages = async (userId) => {
    try {
      const res = await API.get(`/api/v1/message/${userId}`, {
        withCredentials: true,
      });
      setMessages(res.data.messages);

      // rejoindre la salle socket.io entre le médecin et le patient
      socket.emit("join", currentUserId);
    } catch (err) {
      console.error("Erreur chargement messages :", err);
    }
  };

  // 📩 Réception en temps réel
  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      if (
        message.sender._id === selectedUser?._id ||
        message.receiver === selectedUser?._id
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [selectedUser]);

  // ✉️ Envoyer message
  const handleSend = async () => {
  if (!text.trim() || !selectedUser) return;

  try {
    const res = await API.post(
      "/api/v1/send",
      {
        receiverId: selectedUser._id,
        content: text, // ✅ renomme ici
      },
      { withCredentials: true }
    );

    socket.emit("sendMessage", res.data.data); // émettre le message à socket
    setMessages((prev) => [...prev, res.data.data]);
    setText("");
  } catch (err) {
    console.error("Erreur envoi message :", err);
  }
};


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Utilisateurs */}
      <div className="w-1/4 bg-white p-4 overflow-y-auto border-r">
        <h2 className="text-xl font-bold text-emerald-600 mb-4">Patients</h2>
        {conversations.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              fetchMessages(user._id);
            }}
            className={`p-2 cursor-pointer rounded hover:bg-emerald-100 ${
              selectedUser?._id === user._id ? "bg-emerald-200" : ""
            }`}
          >
            <p className="font-semibold">{user.firstName} {user.lastName}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex flex-col w-3/4 p-4">
        <div className="flex-1 bg-white rounded-md shadow-inner p-4 overflow-y-auto">
          {selectedUser ? (
            <>
              <h3 className="text-lg font-semibold text-emerald-700 mb-4">
                Discussion avec {selectedUser.firstName}
              </h3>
              <div className="space-y-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.sender._id === currentUserId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg max-w-sm ${
                        msg.sender._id === currentUserId
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.content || msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </>
          ) : (
            <p className="text-gray-600">Sélectionnez un patient pour commencer une discussion.</p>
          )}
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Répondre au message..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={handleSend}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
            >
              <FaPaperPlane />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChatPage;
