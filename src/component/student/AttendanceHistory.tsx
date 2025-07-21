'use client';
import { CalendarBlank } from 'phosphor-react';

interface AttendanceRecord {
  date: string;
  status: 'Hadir' | 'Izin' | 'Alpha'; // tambahin lagi kalau ada status lain
  time: string;
}

export default function AttendanceHistory({ history }: { history: AttendanceRecord[] }
) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Riwayat Absensi</h3>
        <button className="text-indigo-600 font-medium hover:text-indigo-800">Lihat Semua</button>
      </div>

      <div className="space-y-3">
        {history.map((attendance, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${attendance.status === 'Hadir' ? 'bg-emerald-100 text-emerald-600' :
                attendance.status === 'Izin' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                <CalendarBlank size={20} weight="bold" />
              </div>
              <div>
                <p className="font-medium text-gray-800">{attendance.date}</p>
                <p className="text-gray-500 text-sm">Status: {attendance.status}</p>
              </div>
            </div>
            <div className={`font-medium ${attendance.status === 'Hadir' ? 'text-emerald-600' :
              attendance.status === 'Izin' ? 'text-amber-600' : 'text-rose-600'}`}>
              {attendance.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
