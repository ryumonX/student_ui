'use client';

import { useEffect, useState } from 'react';
import { QrCode } from 'phosphor-react';
import API from '@/lib/AxioClient';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id'); // gunakan locale Bahasa Indonesia

interface Student {
  id: number;
  name: string;
  studentId: string;
  dateOfBirth: string;
}

export default function WelcomeBanner({ setShowFullQR }: { setShowFullQR: (show: boolean) => void }) {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return;

    try {
      const parsed = JSON.parse(storedUser);
      const id = parsed.id;

      const fetchStudent = async () => {
        try {
          const res = await API.get(`/user/${id}`);
          setStudent(res.data);
        } catch (error) {
          console.error('Gagal mengambil data user', error);
        }
      };

      fetchStudent();
    } catch {
      console.error('Data user di localStorage tidak valid');
    }
  }, []);

  if (!student) return null;

  return (
    <div className="mb-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 shadow-lg relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10"></div>
      <div className="absolute -right-20 top-16 w-48 h-48 rounded-full bg-white/5"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Selamat Datang, {student.name} 👋</h2>
          <p className="text-indigo-100">Pantau perkembangan akademik Anda di satu tempat</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div
            className="bg-white/20 p-2 rounded-lg cursor-pointer hover:bg-white/30 transition-colors"
            onClick={() => setShowFullQR(true)}
          >
            <QrCode size={24} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-indigo-200">Tanggal Lahir</p>
            <p className="font-medium">{dayjs(student.dateOfBirth).format('DD MMMM YYYY')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
