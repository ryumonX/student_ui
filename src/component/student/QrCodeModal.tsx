'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import API from '@/lib/AxioClient';
// import axios from '@/lib/axiosInstance'; // sesuaikan path axios
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

interface Student {
  id: number;
  name: string;
  class: string;
  qrcode: string;
  createdAt: string;
}

export default function QRCodeModal({ onClose }: { onClose: () => void }) {
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
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 max-w-md w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">QR Code Siswa</h3>

        <div className="bg-indigo-50 p-6 rounded-xl flex items-center justify-center mb-6">
          <QRCode
            value={student.qrcode}
            size={200}
            bgColor="#ffffff"
            fgColor="#4f46e5"
          />
        </div>

        <div className="mb-6">
          <p className="text-lg font-medium text-gray-800">{student.name}</p>
          <p className="text-gray-600">{student.class}</p>
          <p className="text-sm text-gray-500 mt-1">
            Joining Date: {dayjs(student.createdAt).format('DD MMMM YYYY')}
          </p>
        </div>

        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          onClick={onClose}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
