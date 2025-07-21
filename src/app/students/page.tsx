// app/student/dashboard/page.tsx
'use client';

import * as React from 'react';
import QRCodeModal from '@/component/student/QrCodeModal';
import ProfileCard from '@/component/student/ProfileCard';
import RecentActivities from '@/component/student/RecentActivities';
import StatsCards from '@/component/student/StatsCard';
import WelcomeBanner from '@/component/student/WelcomeBanner';
import Header from '@/component/student/Header';
import LoadingAnimation from '@/component/loading';
import {
  CalendarCheck, ChartBar, Activity, 
  Student, CaretRight, QrCode, GraduationCap, Trophy, Rocket, 
} from 'phosphor-react';

export interface Student {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  qrcode: string;
  classId?: number;
  createdAt: string;
  destinationCountry?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  jobName?: string;
  progressNumber?: number;
}

  export default function StudentDashboard() {
    const [loading, setLoading] = React.useState(true);
    const [showFullQR, setShowFullQR] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);
    const [featureHover, setFeatureHover] = React.useState<number | null>(null);

    React.useEffect(() => {
      setTimeout(() => {
      
        setLoading(false);
      }, 1000);
      setMounted(true);
    }, []);

    const features = [
      {
        title: 'Absensi',
        description: 'Riwayat kehadiran Anda',
        icon: <CalendarCheck size={28} className="text-emerald-500" weight="duotone" />,
        href: '/students/attendance',
        bg: 'bg-gradient-to-br from-emerald-50/80 to-white',
        color: 'bg-emerald-100',
        accent: 'emerald'
      },
      {
        title: 'Rapor',
        description: 'Nilai akademik dan evaluasi',
        icon: <ChartBar size={28} className="text-blue-500" weight="duotone" />,
        href: '/students/raport',
        bg: 'bg-gradient-to-br from-blue-50/80 to-white',
        color: 'bg-blue-100',
        accent: 'blue'
      },
      {
        title: 'Progres',
        description: 'Perkembangan belajar',
        icon: <Activity size={28} className="text-purple-500" weight="duotone" />,
        href: '/students/progress',
        bg: 'bg-gradient-to-br from-purple-50/80 to-white',
        color: 'bg-purple-100',
        accent: 'purple'
      }
    ];

    if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100">
        <div className="relative">
          <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-lg opacity-75 animate-pulse"></div>
          <LoadingAnimation />
        </div>
      </div>
    );

    return (
      <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-indigo-200 opacity-20"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>

        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10">
          {/* Welcome Banner with Glowing Effect */}
          <div className="mb-8 animate-float-in">
            <div className="relative">
              <div className="absolute -inset-3 bg-indigo-500 rounded-2xl blur-xl opacity-10 animate-pulse-slow"></div>
              <div className="glass-effect rounded-2xl shadow-2xl p-6 border border-white/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full translate-x-16 -translate-y-16 opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full -translate-x-16 translate-y-16 opacity-10"></div>
                <WelcomeBanner setShowFullQR={setShowFullQR} />
              </div>
            </div>
          </div>

          {/* Stats Cards with Interactive Progress */}
          <StatsCards />

          {/* Main Features with Floating Icons */}
          <div className="mb-10 animate-slide-up delay-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Rocket size={24} className="text-amber-500 mr-2" weight="fill" />
                Fitur Utama
              </h2>
              <div className="flex items-center text-sm font-medium text-indigo-600">
                Jelajahi semua <CaretRight size={16} className="ml-1" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {features.map((feature, index) => (
                <a
                  key={index}
                  href={feature.href}
                  className={`${feature.bg} rounded-2xl p-6 border border-white shadow-xl hover:shadow-2xl transition-all duration-300 transform 
                  hover:-translate-y-1.5 relative overflow-hidden group ${featureHover === index ? 'ring-2 ring-indigo-300' : ''
                    }`}
                  onMouseEnter={() => setFeatureHover(index)}
                  onMouseLeave={() => setFeatureHover(null)}
                >
                  {/* Floating icon effect */}
                  <div className={`absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${featureHover === index ? 'animate-float' : ''
                    }`}>
                    {React.cloneElement(feature.icon, { size: 64 })}
                  </div>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="relative z-10 flex flex-col">
                    <div className={`p-3 rounded-xl ${feature.color} bg-opacity-30 shadow-inner w-12 h-12 flex items-center justify-center mb-4 transition-transform ${featureHover === index ? 'transform rotate-12 scale-110' : ''
                      }`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-indigo-700 transition-colors">{feature.title}</h3>
                      <p className="text-gray-600 mt-1 text-sm">{feature.description}</p>
                      <div className="mt-4 inline-flex items-center text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                        Akses sekarang
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Achievement Banner */}
          <div className="mb-8 animate-fade-in delay-200">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 opacity-90"></div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400 rounded-full -translate-x-1/2 translate-y-1/2 opacity-20"></div>

              <div className="relative z-10 p-6 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <Trophy size={40} className="text-white mr-4" weight="fill" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Siswaku: Student</h3>
                    <p className="text-amber-100 mt-1">Berangkat jadi imigran pulang jadi juragan!</p>
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <div className="h-2 bg-amber-700 bg-opacity-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <p className="text-white text-sm text-center mt-2">menuju sukses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid untuk Recent Activities dan Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-slide-up delay-300">

            <RecentActivities />
            <div className="glass-effect rounded-2xl shadow-2xl p-6 border border-white/80 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-green-200 rounded-full -translate-y-1/3 -translate-x-1/3 opacity-10"></div>
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-pink-200 rounded-full translate-y-1/3 translate-x-1/3 opacity-10"></div>

              <ProfileCard setShowFullQR={setShowFullQR} />
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="bg-white/90 backdrop-blur-lg border-t border-white/70 py-6 mt-12 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row justify-center items-center gap-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <GraduationCap size={16} className="text-white" />
                </div>
                <span className="ml-2 text-gray-800 font-bold">SiswaKu</span>
              </div>
              <p className="text-gray-600 text-sm">© 2023 Sistem Akademik SiswaKu</p>
              <p className="text-gray-500 text-sm">Dashboard Siswa v3.0</p>
              <p className="text-green-500 text-sm font-medium flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Online
              </p>
            </div>
          </div>
        </footer>

        {showFullQR && <QRCodeModal onClose={() => setShowFullQR(false)} />}

        {/* Floating Action Button with Animation */}
        <button
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-xl flex items-center justify-center text-white hover:shadow-2xl transition-all z-30 group animate-bounce-slow"
          onClick={() => setShowFullQR(true)}
        >
          <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center justify-center">
            <QrCode size={24} weight="bold" />
          </div>
          <span className="absolute top-0 -mt-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
            QR Saya
          </span>
        </button>
      </div>
    );
  }

