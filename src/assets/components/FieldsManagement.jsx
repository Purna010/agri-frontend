import React, { useState, useEffect } from "react";
import { getUserFields, createField } from "../../api/client"; // Implement in client.js

export default function FieldsManagement() {
  const [fields, setFields] = useState([]);
  const [fieldName, setFieldName] = useState("");
  const [cropType, setCropType] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserFields()
      .then(setFields)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddField = async (e) => {
    e.preventDefault();
    if (!fieldName.trim()) {
      setError("Field name is required");
      return;
    }
    try {
      const newField = await createField({ name: fieldName, crop_type: cropType, location });
      setFields((prev) => [...prev, newField]);
      setFieldName("");
      setCropType("");
      setLocation("");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-6">Manage Fields</h2>
      {error && <p className="text-red-700 mb-3">{error}</p>}

      <form onSubmit={handleAddField} className="mb-6">
        <input type="text" placeholder="Field name" value={fieldName} onChange={(e) => setFieldName(e.target.value)} required className="mb-3 p-2 border rounded w-full" />
        <input type="text" placeholder="Crop type (optional)" value={cropType} onChange={(e) => setCropType(e.target.value)} className="mb-3 p-2 border rounded w-full" />
        <input type="text" placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} className="mb-3 p-2 border rounded w-full" />
        <button type="submit" className="py-2 px-4 bg-green-600 text-white rounded">Add Field</button>
      </form>

      <ul>
        {fields.map((f) => (
          <li key={f.id} className="py-1 border-b">
            <strong>{f.name}</strong> {f.crop_type && `- Crop: ${f.crop_type}`} {f.location && `- Location: ${f.location}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
