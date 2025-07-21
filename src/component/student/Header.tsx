'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Chalkboard,
  User,
  SignOut,
  List,
  X
} from 'phosphor-react';

interface Student {
  name: string;
  email: string;
  role: string;
  class?: string;
}

export default function Header() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setStudent({
          name: parsedUser.name,
          email: parsedUser.email,
          role: parsedUser.role,
          class: parsedUser.classId ? `Kelas ${parsedUser.classId}` : 'Tidak ada kelas',
        });
      } catch (error) {
        console.error('Gagal memuat data user dari localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

 const handleLogout = () => {
  // Hapus localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');

  document.cookie = 'token=; Max-Age=0; path=/;';
  document.cookie = 'user=; Max-Age=0; path=/;';

  router.push('/auth/login');
};

 

  if (!student) return null;

  return (
    <header className="max-w-6xl mx-auto mb-4 sm:mb-8 px-4 sm:px-6">
      <div className="flex justify-between items-center py-4">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <button
            className="mr-3 sm:hidden text-indigo-800"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Buka menu"
          >
            <List size={24} weight="bold" />
          </button>

          <div className="flex items-center">
            <Chalkboard size={32} className="text-indigo-700" weight="duotone" />
            <div className="ml-2">
              <h1 className="text-xl sm:text-3xl font-bold text-indigo-800">SiswaKu</h1>
              <p className="hidden sm:block text-indigo-600 text-sm">Dashboard Akademik Siswa</p>
            </div>
          </div>
        </div>

        {/* Right - Notif & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow transition-all"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
              }}
              aria-label="Profil pengguna"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-base">{student.name.charAt(0)}</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-gray-800 text-sm sm:text-base">{student.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">{student.role}</p>
              </div>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-600">{student.role}</p>
                </div>
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700">
                    <User className="mr-3" size={18} />
                    <span>Profil Saya</span>
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-red-600"
                  >
                    <SignOut className="mr-3" size={18} />
                    <span>Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden">
          <div
            ref={menuRef}
            className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white z-50 shadow-xl"
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <Chalkboard size={32} className="text-indigo-700" weight="duotone" />
                <h1 className="ml-2 text-xl font-bold text-indigo-800">SiswaKu</h1>
              </div>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Tutup menu"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">{student.name.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">{student.name}</p>
                <p className="text-sm text-gray-600">{student.role}</p>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600"
              >
                <SignOut className="mr-2" size={20} />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
