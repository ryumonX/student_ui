'use client';

import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { UserCircle, Calendar, Clock, GraduationCap } from 'phosphor-react';
import { ReactNode } from 'react';
import API from '@/lib/AxioClient';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

type Student = {
  id: number;
  name: string;
  class: string;
  role: string;
  studentId: string;
  dateOfBirth: string;
  createdAt: string;
  destinationCountry: string;
  qrcode: string;
};

export default function ProfileCard({
  setShowFullQR,
}: {
  setShowFullQR: (val: boolean) => void;
}) {
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const id = parsed.id;

      const fetchStudent = async () => {
        try {
          const res = await API.get(`/user/${id}`);
          setStudent(res.data);
        } catch (error) {
          console.error('Gagal fetch student:', error);
        }
      };

      fetchStudent();
    } catch {
      console.error('User di localStorage tidak valid');
    }
  }, []);

  if (!student) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-white/10"></div>
      <div className="absolute -right-20 bottom-0 w-48 h-48 rounded-full bg-white/5"></div>

      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mr-4">
            <UserCircle size={40} className="text-indigo-500" weight="duotone" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{student.name}</h3>
            <p className="text-indigo-100">
              Role • {student.role}
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <InfoRow
            icon={<Calendar size={20} weight="bold" />}
            label="Tanggal Lahir"
            value={dayjs(student.dateOfBirth).format('DD MMMM YYYY')}
          />
          <InfoRow
            icon={<Clock size={20} weight="bold" />}
            label="Tanggal Bergabung "
            value={dayjs(student.createdAt).format('DD MMMM YYYY')}
          />
          <InfoRow
            icon={<GraduationCap size={20} weight="bold" />}
            label="Negara Tujuan"
            value={student.destinationCountry || '-'}
          />
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-white/10 rounded-xl border border-white/20">
          <QRCode
            value={student.qrcode}
            size={100}
            bgColor="transparent"
            fgColor="#ffffff"
            className="mb-2"
          />
          <p className="text-center text-sm text-indigo-100 mt-2">ID: {student.studentId}</p>
          <button
            className="mt-2 text-xs text-indigo-100 hover:text-white underline"
            onClick={() => setShowFullQR(true)}
          >
            Lihat QR Code
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center">
      <div className="bg-white/20 p-2 rounded-lg mr-3">{icon}</div>
      <div>
        <p className="text-sm text-indigo-200">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
