'use client';

import { User, Phone, At, MapPin, Briefcase, Student } from 'phosphor-react';
import React from 'react';
import { useUser } from '@/hook/useuserprofile';

interface ApplicantProfileCardProps {
  applicant: { Status?: string } | null;
}


const UserProfileCard: React.FC<ApplicantProfileCardProps> = ({ applicant }) => {
  const { user, loading, error } = useUser();

  if (loading) return <div className="p-6 text-center">Loading user data...</div>;
  if (error || !user) return <div className="p-6 text-center text-red-600">Failed to load user profile.</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 mb-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="bg-indigo-100 p-3 rounded-full mr-4 mb-4 md:mb-0">
          <User size={48} className="text-indigo-600" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.name || 'No Name'}
          </h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
              <Briefcase size={16} className="mr-1" />
              {user.jobName || 'Unknown'}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
              <Student size={16} className="mr-1" />
              {user.role || 'Not Specified'}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center justify-center md:justify-start">
              <Phone size={18} className="text-gray-500 mr-2" />
              <span>{user.phoneNumber || '-'}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <At size={18} className="text-gray-500 mr-2" />
              <span>{user.email || '-'}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start">
              <MapPin size={18} className="text-gray-500 mr-2" />
              <span>{user.destinationCountry || '-'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 md:mt-0">
          <div
            className={`px-4 py-2 rounded-full text-center ${
              applicant?.Status === 'SIGNED'
                ? 'bg-green-100 text-green-800'
                :  applicant?.Status === 'REJECTED'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            <span className="font-bold">{applicant?.Status || 'pending'}</span>
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">Application Status</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
