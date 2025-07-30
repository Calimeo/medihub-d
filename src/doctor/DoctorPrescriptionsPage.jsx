// doctor/DoctorPrescriptionsPage.jsx
import React, { useState } from "react";

const initialPrescriptions = [
  {
    id: 1,
    patientName: "Jeanne Dubois",
    date: "2024-06-20",
    medication: "Paracétamol 500mg",
    dosage: "1 comprimé toutes les 6h",
    duration: "5 jours",
    notes: "À prendre après les repas",
  },
  {
    id: 2,
    patientName: "Michel Fournier",
    date: "2024-06-18",
    medication: "Ibuprofène 200mg",
    dosage: "2 comprimés 3 fois par jour",
    duration: "7 jours",
    notes: "",
  },
];

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState(initialPrescriptions);
  const [formData, setFormData] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    duration: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  }

  function validate() {
    if (!formData.patientName.trim()) return "Le nom du patient est requis.";
    if (!formData.medication.trim()) return "Le médicament est requis.";
    if (!formData.dosage.trim()) return "Le dosage est requis.";
    if (!formData.duration.trim()) return "La durée du traitement est requise.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    const newPrescription = {
      id: Date.now(),
      ...formData,
      date: new Date().toISOString().split("T")[0],
    };
    setPrescriptions((prev) => [newPrescription, ...prev]);
    setFormData({
      patientName: "",
      medication: "",
      dosage: "",
      duration: "",
      notes: "",
    });
    setSuccess("Prescription enregistrée avec succès !");
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow space-y-10">
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Prescrire des traitements
      </h1>

      <section className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="patientName"
              className="block font-semibold mb-1 text-gray-700"
            >
              Nom du patient <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
              autoComplete="off"
              placeholder="Ex: Jeanne Dubois"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="medication"
              className="block font-semibold mb-1 text-gray-700"
            >
              Médicament <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="medication"
              name="medication"
              value={formData.medication}
              onChange={handleChange}
              required
              autoComplete="off"
              placeholder="Ex: Paracétamol 500mg"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="dosage"
              className="block font-semibold mb-1 text-gray-700"
            >
              Dosage <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              placeholder="Ex: 1 comprimé toutes les 6h"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block font-semibold mb-1 text-gray-700"
            >
              Durée du traitement <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="Ex: 5 jours"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block font-semibold mb-1 text-gray-700"
            >
              Notes / Instructions complémentaires
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Ex: À prendre après les repas"
              className="w-full px-3 py-2 border border-gray-300 rounded resize-none focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>

          {error && (
            <p className="text-red-600 font-semibold text-center">{error}</p>
          )}
          {success && (
            <p className="text-green-600 font-semibold text-center">{success}</p>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition"
          >
            Prescrire
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          Prescriptions enregistrées
        </h2>
        {prescriptions.length === 0 ? (
          <p className="text-center text-gray-600 italic">
            Aucune prescription enregistrée.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300 rounded shadow-sm">
              <thead className="bg-green-100 text-green-800 font-semibold">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Patient
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Médicament
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Dosage
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Durée
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(
                  ({
                    id,
                    patientName,
                    date,
                    medication,
                    dosage,
                    duration,
                    notes,
                  }) => (
                    <tr
                      key={id}
                      className="hover:bg-green-50 transition"
                      tabIndex={0}
                      aria-label={`Prescription pour ${patientName} le ${date}, médicament ${medication}, dosage ${dosage}, durée ${duration}, notes ${notes}`}
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        {patientName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {date}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {medication}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {dosage}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {duration}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {notes || "-"}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}