"use client";
import { useEffect, useState } from "react";
import { getSocieties } from "../services/society";

export default function SocietyDropdown({ onSelect }) {
  const [societies, setSocieties] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSocieties = async () => {
      try {
        setLoading(true);
        const data = await getSocieties({});
        setSocieties(data?.data || data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadSocieties();
  }, []);

  const filtered = societies.filter((s) =>
    `${s.societyName} ${s.address} ${s.city}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search society..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full px-3 py-2 border rounded-lg"
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg max-h-60 overflow-auto shadow">
          {loading && (
            <div className="p-2 text-sm text-gray-500">Loading...</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="p-2 text-sm text-gray-500">
              No society found
            </div>
          )}

          {filtered.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                onSelect(s);
                setSearch(s.societyName);
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100"
            >
              <div className="font-medium">{s.societyName}</div>
              <div className="text-xs text-gray-500">
                {s.address}, {s.city}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
