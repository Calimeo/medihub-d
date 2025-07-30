import React from "react";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserCircleIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const links = [
    {
      name: "Rendez-vous",
      to: "/doctor/appointment",
      icon: <CalendarDaysIcon className="h-8 w-8 text-blue-500" />,
    },
    {
      name: "Dossiers Patients",
      to: "/doctor/patient",
      icon: <UserGroupIcon className="h-8 w-8 text-green-500" />,
    },
    {
      name: "Messages",
      to: "/doctor/message",
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500" />,
    },
    {
      name: "Planning",
      to: "/doctor/schedule",
      icon: <ClockIcon className="h-8 w-8 text-orange-500" />,
    },
    {
      name: "Profile",
      to: "/doctor/me",
      icon: <UserCircleIcon className="h-8 w-8 text-orange-500" />,
    },
    {
      name: "Prescription",
      to: "/doctor/prescri",
      icon: <ClipboardDocumentIcon className="h-8 w-8 text-orange-500" />,
    },
     {
      name: "inbox",
      to: "/doctor/inbox",
      icon: <ClipboardDocumentIcon className="h-8 w-8 text-orange-500" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* ✅ Message de bienvenue */}
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-red-700">
          Bienvenue sur votre tableau de bord médical
        </h1>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Accédez rapidement à vos outils essentiels pour gérer vos patients, vos rendez-vous et votre emploi du temps.
        </p>
      </div>

      {/* ✅ Grille de navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {links.map((link) => (
          <Link to={link.to} key={link.name}>
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
              {link.icon}
              <span className="mt-4 text-lg font-semibold text-gray-700">
                {link.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
