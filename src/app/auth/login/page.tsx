'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth';
import { Envelope, LockKey, Eye, EyeSlash, SpinnerGap, Buildings, User, ShieldCheck } from 'phosphor-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setShowAnimation(true);
    
    // Check if mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const res = await login(email, password);

    if (res.success) {
      // Simpan ke localStorage
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }

      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }

      router.push('/students');
    } else {
      setError(res.message || 'Login failed. Please try again.');
    }
  } catch {
    setError('An unexpected error occurred.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] p-4 relative overflow-hidden">
      {/* Animated Background Elements - Simplified for mobile */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-indigo-600 opacity-15 blur-3xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full bg-cyan-500 opacity-15 blur-3xl animate-pulse animation-delay-4000"></div>
        </div>
      )}
      
      {/* Login Card */}
      <div className={`relative z-10 bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl transition-all duration-1000 ease-out ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex flex-col md:flex-row">
          {/* Brand Side - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex flex-col bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-6 md:p-8 lg:p-10 md:w-1/2 items-center justify-center text-center">
            <div className="mb-4 md:mb-8 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="absolute -inset-3 sm:-inset-4 bg-blue-600 rounded-full opacity-70 blur-lg"></div>
                <div className="relative bg-blue-700 rounded-full p-3 sm:p-4">
                  <Buildings size={isMobile ? 32 : 48} weight="fill" className="text-white" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">DELTA ABADI</h1>
                <h2 className="text-base sm:text-lg md:text-xl font-medium text-blue-300">INTERNATIONAL</h2>
              </div>
            </div>
            
            <div className="mt-4 md:mt-8 w-full max-w-xs">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-900/50 rounded-full p-2 sm:p-3">
                    <ShieldCheck size={isMobile ? 24 : 32} className="text-blue-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">Secure Access</h3>
                  <p className="text-blue-200 text-xs sm:text-sm">Enterprise-grade security</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-900/50 rounded-full p-2 sm:p-3">
                    <User size={isMobile ? 24 : 32} className="text-blue-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white">Role-Based Access</h3>
                  <p className="text-blue-200 text-xs sm:text-sm">Personalized user experience</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <p className="text-blue-300 text-xs sm:text-sm">
                © 2023 Delta Abadi International. All rights reserved.
              </p>
            </div>
          </div>
          
          {/* Mobile Brand Header */}
          <div className="md:hidden bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] p-4 flex items-center justify-center">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="absolute -inset-2 bg-blue-600 rounded-full opacity-70 blur-md"></div>
                <div className="relative bg-blue-700 rounded-full p-2">
                  <Buildings size={24} weight="fill" className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">DELTA ABADI</h1>
                <h2 className="text-sm font-medium text-blue-300">INTERNATIONAL</h2>
              </div>
            </div>
          </div>
          
          {/* Form Side */}
          <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 w-full md:w-1/2">
            <div className="text-center mb-6 md:mb-8 lg:mb-10">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                Sign in to your Delta Abadi account
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 sm:mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              <div className="mb-4 sm:mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Work Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Envelope size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.name@deltaabadi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <label htmlFor="password" className="block text-gray-700 mb-2 font-medium text-sm sm:text-base">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockKey size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 sm:py-3 rounded-lg border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition duration-200 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlash size={18} className="text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye size={18} className="text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start justify-between mb-6 sm:mb-8 gap-3">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 text-xs sm:text-sm">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out flex items-center justify-center text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <SpinnerGap size={20} className="animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>
            
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
              <p className="text-gray-600 text-center text-xs sm:text-sm">
                Need help? <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Contact IT Support</a>
              </p>
            </div>
            
            {/* Mobile Footer */}
            <div className="mt-6 md:hidden pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-900/20 rounded-full p-1.5">
                    <ShieldCheck size={16} className="text-blue-500" />
                  </div>
                  <span className="ml-2 text-xs text-gray-600">Secure</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-900/20 rounded-full p-1.5">
                    <User size={16} className="text-blue-500" />
                  </div>
                  <span className="ml-2 text-xs text-gray-600">Role Access</span>
                </div>
              </div>
              <p className="mt-4 text-center text-gray-500 text-xs">
                © 2023 Delta Abadi International
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        .animate-pulse {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}