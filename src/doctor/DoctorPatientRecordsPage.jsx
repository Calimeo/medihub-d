// doctor/DoctorPatientRecordsPage.jsx
import React, { useState, useEffect } from "react";

const dummyPatients = [
  {
    id: 11,
    name: "Jeanne Dubois",
    birthDate: "1987-04-15",
    phone: "06 12 34 56 78",
    address: "12 rue de la paix, 75002 Paris",
    documents: [
      {
        id: 100,
        type: "Ordonnance",
        date: "2024-06-10",
        title: "Ordonnance Médicaments hypertension",
        fileUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      {
        id: 101,
        type: "Diagnostic",
        date: "2024-05-15",
        title: "Diagnostic tension artérielle",
        fileUrl:
          "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
    history: [
      {
        id: 1000,
        date: "2024-06-10",
        type: "Prescription",
        content:
          "Prescrit 10mg Amlodipine par jour pendant 1 mois.",
      },
      {
        id: 1001,
        date: "2024-05-15",
        type: "Diagnostic",
        content: "Hypertension diagnostiquée, recommandation activité physique.",
      },
    ],
  },
  {
    id: 12,
    name: "Michel Fournier",
    birthDate: "1975-11-02",
    phone: "06 98 76 54 32",
    address: "45 avenue de la République, 75011 Paris",
    documents: [],
    history: [],
  },
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR");
}

export default function DoctorPatientRecordsPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [activeTab, setActiveTab] = useState("documents"); // "documents" or "history"
  const [diagnosticContent, setDiagnosticContent] = useState("");
  const [prescriptionContent, setPrescriptionContent] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPatients(dummyPatients);
    setSelectedPatientId(dummyPatients.length > 0 ? dummyPatients[0].id : null);
  }, []);

  function addEntry(type, content) {
    if (!content.trim()) {
      setMessage("Le contenu ne peut pas être vide.");
      return;
    }
    setPatients((prevPatients) =>
      prevPatients.map((p) => {
        if (p.id === selectedPatientId) {
          const date = new Date().toISOString().split("T")[0];
          return {
            ...p,
            history: [
              ...p.history,
              {
                id: Date.now(),
                date,
                type,
                content,
              },
            ],
          };
        }
        return p;
      }),
    );
    setMessage(`${type} ajouté avec succès !`);
    if (type === "Diagnostic") setDiagnosticContent("");
    if (type === "Prescription") setPrescriptionContent("");
    if (type === "Compte-rendu") setReportContent("");
  }

  if (!selectedPatientId) {
    return (
      <div className="text-center text-gray-600 mt-20 font-semibold">
        Aucun dossier patient à afficher.
      </div>
    );
  }

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded shadow flex flex-col md:flex-row gap-8">
      <section className="md:w-1/4 border-r border-gray-200 pr-4">
        <h2 className="text-xl font-bold text-green-600 mb-4">Patients</h2>
        <ul className="space-y-2 max-h-[80vh] overflow-y-auto">
          {patients.map(({ id, name }) => (
            <li key={id}>
              <button
                onClick={() => {
                  setSelectedPatientId(id);
                  setMessage("");
                  setActiveTab("documents");
                }}
                className={`w-full text-left px-3 py-2 rounded ${
                  id === selectedPatientId
                    ? "bg-green-200 font-semibold text-green-900"
                    : "hover:bg-green-50"
                }`}
                aria-current={id === selectedPatientId ? "true" : undefined}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="md:w-3/4 flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between md:items-end">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              {selectedPatient.name}
            </h3>
            <p className="text-sm italic text-gray-600">
              Né(e) le {formatDate(selectedPatient.birthDate)} |{" "}
              {selectedPatient.phone} | {selectedPatient.address}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("documents")}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeTab === "documents"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Documents
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded font-semibold transition ${
                activeTab === "history"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Historique
            </button>
          </div>
        </header>

        {activeTab === "documents" && (
          <div>
            {selectedPatient.documents.length === 0 ? (
              <p className="text-gray-600 italic">
                Aucun document à afficher.
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {selectedPatient.documents.map(
                  ({ id, type, date, title, fileUrl }) => (
                    <li
                      key={id}
                      className="flex justify-between items-center py-3 hover:bg-green-50 rounded transition px-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{title}</p>
                        <p className="text-sm italic text-green-700">{type}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(date)}
                        </p>
                      </div>
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                        aria-label={`Voir document ${title}`}
                      >
                        Voir le document
                      </a>
                    </li>
                  ),
                )}
              </ul>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-green-700 mb-3">
                Historique médical
              </h4>
              {selectedPatient.history.length === 0 ? (
                <p className="italic text-gray-600">
                  Aucun historique disponible.
                </p>
              ) : (
                <ul className="divide-y divide-gray-300 max-h-[300px] overflow-y-auto">
                  {selectedPatient.history
                    .slice()
                    .reverse()
                    .map(({ id, date, type, content }) => (
                      <li key={id} className="py-3 px-4">
                        <p className="text-sm text-gray-500">
                          {formatDate(date)} - <span className="font-semibold">{type}</span>
                        </p>
                        <p className="mt-1 text-gray-800 whitespace-pre-wrap">{content}</p>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <div className="bg-green-50 p-4 rounded shadow-inner">
              <h4 className="text-lg font-semibold text-green-600 mb-3">
                Ajouter un Diagnostic, une Prescription ou un Compte-rendu
              </h4>
              <div className="flex flex-col gap-4">
                <textarea
                  rows={3}
                  placeholder="Diagnostic"
                  value={diagnosticContent}
                  onChange={(e) => {
                    setDiagnosticContent(e.target.value);
                    setMessage("");
                  }}
                  className="w-full px-3 py-2 border rounded border-green-300 focus:ring-green-500 focus:border-green-500 resize-none"
                  aria-label="Ajouter un diagnostic"
                />
                <textarea
                  rows={3}
                  placeholder="Prescription"
                  value={prescriptionContent}
                  onChange={(e) => {
                    setPrescriptionContent(e.target.value);
                    setMessage("");
                  }}
                  className="w-full px-3 py-2 border rounded border-green-300 focus:ring-green-500 focus:border-green-500 resize-none"
                  aria-label="Ajouter une prescription"
                />
                <textarea
                  rows={3}
                  placeholder="Compte-rendu"
                  value={reportContent}
                  onChange={(e) => {
                    setReportContent(e.target.value);
                    setMessage("");
                  }}
                  className="w-full px-3 py-2 border rounded border-green-300 focus:ring-green-500 focus:border-green-500 resize-none"
                  aria-label="Ajouter un compte-rendu"
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  onClick={() => addEntry("Diagnostic", diagnosticContent)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Ajouter Diagnostic
                </button>
                <button
                  onClick={() => addEntry("Prescription", prescriptionContent)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Ajouter Prescription
                </button>
                <button
                  onClick={() => addEntry("Compte-rendu", reportContent)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
                >
                  Ajouter Compte-rendu
                </button>
              </div>

              {message && (
                <p className="mt-4 text-green-800 font-semibold">{message}</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}