'use client';

import React, { useEffect, useState } from 'react';
import { CaretRight, Clock } from 'phosphor-react';
import API from '@/lib/AxioClient';
import dayjs from 'dayjs';

interface Attendance {
  id: number;
  date: string;
  time: string;
  method: string;
  status: string;
}

interface Activity {
  id: number;
  title: string;
  time: string;
  icon: React.ReactNode;
}

export default function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchRecentAttendances = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const user = JSON.parse(userData);
        const res = await API.get(`/attendances/history/${user.id}`);
        const attendances: Attendance[] = res.data.attendance || [];

        const latest = attendances
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5)
          .map((item) => ({
            id: item.id,
            title: `Hadir (${item.status}) via ${item.method}`,
            time: dayjs(item.time).format('DD MMM YYYY • HH:mm'),
            icon: <Clock size={20} className="text-indigo-500" />,
          }));

        setActivities(latest);
      } catch {
        console.error('Gagal mengambil data aktivitas');
      }
    };

    fetchRecentAttendances();
  }, []);

  return (
    <div className="glass-effect rounded-2xl shadow-2xl p-6 border border-white/80 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 rounded-full -translate-y-1/2 translate-x-1/2 opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200 rounded-full -translate-x-1/2 translate-y-1/2 opacity-10"></div>

      <div className="flex justify-between items-center mb-5 relative z-10">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          Aktivitas Terbaru
          <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
            {activities.length} aktivitas
          </span>
        </h2>
        <a
          href="/students/attendance"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Lihat Semua
        </a>
      </div>

      <div className="space-y-4 relative z-10">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white hover:bg-indigo-50/50 transition-all duration-300 group"
            >
              <div className="p-3 rounded-lg bg-white border border-gray-100 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                {activity.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CaretRight size={20} className="text-gray-400" />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center">Tidak ada aktivitas ditemukan.</p>
        )}
      </div>
    </div>
  );
}
