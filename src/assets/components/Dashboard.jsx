import React, { useEffect, useState } from "react";
import { getUserReports, getUserFields } from "../../api/client";

export default function Dashboard({ auth }) {
  const [reports, setReports] = useState([]);
  const [fields, setFields] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [loadingFields, setLoadingFields] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!auth.token) {
      setReports([]);
      setFields([]);
      setError(null);
      setLoadingReports(false);
      setLoadingFields(false);
      return;
    }

    setLoadingReports(true);
    getUserReports()
      .then(setReports)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingReports(false));

    setLoadingFields(true);
    getUserFields()
      .then(setFields)
      .catch((e) => setError(e.message))
      .finally(() => setLoadingFields(false));
  }, [auth.token]);

  const lastReport = reports.length > 0 ? reports[reports.length - 1] : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      {error && <p className="text-red-700">{error}</p>}

      {lastReport && (
        <section className="mb-8 p-4 border border-green-500 bg-green-900 rounded text-white">
          <h3 className="text-xl font-semibold mb-2">Your Last Report</h3>
          <p>
            <strong>{lastReport.prediction}</strong> ({(lastReport.confidence * 100).toFixed(1)}%)
          </p>
          <p>Field: {lastReport.field?.name || "Unassigned"}</p>
          <p>Date: {new Date(lastReport.created_at).toLocaleString()}</p>
          <p>
            <strong>Reported by:</strong> {lastReport.user?.username || "Unknown"}
          </p>
        </section>
      )}

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Your Reports</h3>
        {loadingReports ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No reports found.</p>
        ) : (
          <ul>
            {reports.map((r) => (
              <li key={r.id} className="p-2 border-b flex justify-between">
                <div>
                  <p>
                    <strong>{r.prediction}</strong> ({(r.confidence * 100).toFixed(1)}%)
                  </p>
                  <p>Field: {r.field?.name || "Unassigned"}</p>
                  <p>Date: {new Date(r.created_at).toLocaleString()}</p>
                  <p>
                    <strong>Reported by:</strong> {r.user?.username || "Unknown"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Your Fields</h3>
        {loadingFields ? (
          <p>Loading fields...</p>
        ) : fields.length === 0 ? (
          <p>No fields added yet.</p>
        ) : (
          <ul>
            {fields.map((f) => (
              <li key={f.id} className="p-2 border-b">
                <p>
                  {f.name} {f.crop_type && `- Crop: ${f.crop_type}`}
                </p>
                <p>{f.location}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
