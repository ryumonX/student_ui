'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, BookOpen, TrendUp } from 'phosphor-react';
import API from '@/lib/AxioClient';

interface Attendance {
  id: number;
  date: string;
  time: string;
  method: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  jobName?: string;
  progressNumber?: number;
}

interface AttendanceStat {
  title: string;
  value: string;
  progress: number;
  color: string;
  description: string;
  icon: React.ReactNode;
}

interface Grade {
  id: number;
  userId: number;
  score: number;
  subject?: string;
  createdAt?: string;
}

function getSchoolDaysThisMonth(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days: string[] = [];
  const totalDays = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days.push(date.toISOString().slice(0, 10));
    }
  }

  return days;
}

async function fetchAllGrades(userId: number): Promise<Grade[]> {
  let page = 0;
  const limit = 100;
  let allGrades: Grade[] = [];
  let hasMore = true;

  while (hasMore) {
    const res = await API.get(`/grades/user/${userId}?page=${page + 1}&limit=${limit}`);
    const data = res.data || [];

    if (Array.isArray(data) && data.length > 0) {
      allGrades = [...allGrades, ...data];
      if (data.length < limit) hasMore = false;
      else page++;
    } else {
      hasMore = false;
    }
  }

  return allGrades;
}

// Helper untuk warna progress bar
function getColorClass(color: string): string {
  const colors: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
  };
  return colors[color] || 'bg-gray-300';
}

export default function StatsCards() {
  const [attendanceStat, setAttendanceStat] = useState<AttendanceStat | null>(null);
  const [averageStat, setAverageStat] = useState<AttendanceStat | null>(null);
  const [progressStat, setProgressStat] = useState<AttendanceStat | null>(null);
  const [activeStat, setActiveStat] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user: User = JSON.parse(storedUser);
        const sheetName = user?.jobName;
        const applicantId = user?.progressNumber?.toString();

        const attendanceRes = await API.get(`/attendances/history/${user.id}`);
        const attendances: Attendance[] = Array.isArray(attendanceRes.data.attendance)
          ? attendanceRes.data.attendance
          : [];

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthAttendances = attendances.filter((a) => {
          const date = new Date(a.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const schoolDays = getSchoolDaysThisMonth();
        const hadirDates = thisMonthAttendances
          .filter((a) => ['present', 'late'].includes(a.status.toLowerCase()))
          .map((a) => new Date(a.date).toISOString().slice(0, 10));

        const uniqueHadirDates = Array.from(new Set(hadirDates));
        const hadirCount = uniqueHadirDates.length;
        const totalShouldAttend = schoolDays.length;

        let attendanceProgress = 0;
        if (totalShouldAttend > 0) {
          const raw = (hadirCount / totalShouldAttend) * 100;
          attendanceProgress = raw > 0 && raw < 1 ? 1 : Math.round(raw);
        }

        setAttendanceStat({
          title: 'Kehadiran',
          value: `${attendanceProgress}%`,
          icon: <CheckCircle size={24} className="text-emerald-600" />,
          progress: attendanceProgress,
          color: 'emerald',
          description: 'Rata-rata kehadiran bulan ini',
        });

        const allGrades = await fetchAllGrades(user.id);
        const totalNilai = allGrades.reduce((acc, curr) => acc + (curr.score || 0), 0);
        const jumlahNilai = allGrades.length;
        const average = jumlahNilai > 0 ? Math.round(totalNilai / jumlahNilai) : 0;

        const totalExpectedGrades = 10;
        const progressGrades = Math.round((jumlahNilai / totalExpectedGrades) * 100);

        setAverageStat({
          title: 'Nilai Rata-rata',
          value: `${average}`,
          icon: <BookOpen size={24} className="text-blue-600" />,
          progress: progressGrades,
          color: 'blue',
          description: 'Rata-rata nilai semester ini',
        });

        if (sheetName && applicantId) {
          const progressRes = await API.get(`/google-sheet/${sheetName}/${applicantId}`);
          const applicant = progressRes.data;

          const progressFields = [
            'VISA', 'DISNAKR ID', 'MEDICAL', 'SKCK', 'KUMHAM',
            'DEPLU', 'EC', 'STAMP VISA', 'OVERSEAS ID', 'TICEKT',
          ];

          const totalSteps = progressFields.length;
          const completedSteps = progressFields.filter(
            (field) => applicant[field] && applicant[field] !== ''
          ).length;

          const progressPercent = Math.round((completedSteps / totalSteps) * 100);

          setProgressStat({
            title: 'Proses',
            value: `${progressPercent}%`,
            icon: <TrendUp size={24} className="text-amber-600" />,
            progress: progressPercent,
            color: 'amber',
            description: 'Perkembangan pembelajaran',
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchData();
  }, []);

  const stats: AttendanceStat[] = [
    attendanceStat ?? {
      title: 'Kehadiran',
      value: '0%',
      icon: <CheckCircle size={24} className="text-emerald-600" />,
      progress: 0,
      color: 'emerald',
      description: 'Rata-rata kehadiran bulan ini',
    },
    averageStat ?? {
      title: 'Nilai Rata-rata',
      value: '0',
      icon: <BookOpen size={24} className="text-blue-600" />,
      progress: 0,
      color: 'blue',
      description: 'Rata-rata nilai semester ini',
    },
    progressStat ?? {
      title: 'Proses',
      value: '0%',
      icon: <TrendUp size={24} className="text-amber-600" />,
      progress: 0,
      color: 'amber',
      description: 'Perkembangan pembelajaran',
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-white shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden
            hover:transform hover:-translate-y-1.5 ${activeStat === index ? 'ring-2 ring-indigo-400 scale-[1.03]' : ''}`}
          onMouseEnter={() => setActiveStat(index)}
          onMouseLeave={() => setActiveStat(null)}
        >
          {/* Animated progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-200 overflow-hidden rounded-b-2xl">
            <div
              className={`h-full transition-all duration-1000 ease-out ${getColorClass(stat.color)}`}
              style={{ width: activeStat === index ? `${stat.progress}%` : '0%' }}
            ></div>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
              <p className="text-xs mt-2 text-gray-500">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-full bg-white shadow-md group-hover:shadow-lg transition-all transform ${activeStat === index ? 'scale-110 rotate-6' : ''
              }`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
