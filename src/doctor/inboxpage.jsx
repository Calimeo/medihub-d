import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "@/axios/axios.js";

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceivedMessages = async () => {
      try {
        const { data } = await API.get(`/api/v1/message/${userId}`, {
          withCredentials: true,
        });
        setMessages(data.messages);
      } catch (error) {
        console.error("Erreur lors du chargement des messages", error);
      }
    };

    fetchReceivedMessages();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Boîte de réception</h2>
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            onClick={() => navigate(`/chat/${msg.sender._id}`)}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={msg.sender?.docAvatar?.url || "/avatar.png"}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {msg.sender.firstName} {msg.sender.lastName}
                </p>
                <p className="text-gray-600 text-sm">{msg.text}</p>
                <p className="text-xs text-gray-400">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InboxPage;
