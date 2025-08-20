"use client";
import { useEffect, useState } from "react";
import API from "@/lib/AxioClient";
import { formatDate } from "@/lib/formatdate";

interface VisaStatus {
  sheet: string;
  name: string;
  passport: string;
  visaExpired: string;
  pk: string;
  createdAt: string;
}

export default function VisaStatusTable() {
  const [data, setData] = useState<VisaStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/google-sheet/visa-status");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching visa status:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-gray-300">Loading...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-700 bg-gray-900 rounded-lg shadow-lg">
        <thead className="bg-black">
          <tr>
            <th className="px-4 py-3 text-left text-white font-medium">Sheet</th>
            <th className="px-4 py-3 text-left text-white font-medium">Name</th>
            <th className="px-4 py-3 text-left text-white font-medium">Passport</th>
            <th className="px-4 py-3 text-left text-white font-medium">Visa Expired</th>
            <th className="px-4 py-3 text-left text-white font-medium">PK Status</th>
            <th className="px-4 py-3 text-left text-white font-medium">Confirmation date</th>
        
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-gray-400">
                No data found
              </td>
            </tr>
          ) : (
            data.map((item, i) => (
              <tr key={i} className="border-t border-gray-700 hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 text-gray-200">{item.sheet}</td>
                <td className="px-4 py-3 font-medium text-white">{item.name}</td>
                <td className="px-4 py-3 text-gray-200">{item.passport}</td>
                <td className="px-4 py-3 text-gray-200">
                  {formatDate(item.visaExpired, "long")}
                </td>
                <td className="px-4 py-3 text-gray-200">
                  {item.pk ? formatDate(item.pk, "long") : "Not Set"}
                </td>
                <td className="px-4 py-3 text-gray-200">
                  {item.createdAt ? formatDate(item.createdAt, "long") : "Not Set"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}