'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, Info } from 'phosphor-react';

import API from '@/lib/AxioClient';
import ApplicantProfileCard from '@/component/progres/ApplicantProfileCard';
import ApplicationStatusSection from '@/component/progres/ApplicationStatusSection';
import ApplicationDetailsCard from '@/component/progres/ApplicationDetailsCard';
import LoadingAnimation from '@/component/loading';
import { useUser } from '@/hook/useuserprofile';

export interface Applicant {
  "No."?: number;
  NAME?: string;
  "Interview date"?: string;
  "OFFER LETTER Received"?: string;
  Send?: string;
  Status?: string;
  "PASSPORT NUMBER"?: string;
  DATE?: string;
  EXPIRED?: string;
  "Passport Diterima"?: boolean;
  "Passport send"?: string;
  "Visa Date"?: string;
  Expired?: string;
  "EC/PK"?: string;
  "KET."?: string;
  DP?: string;
  SPONSOR?: string;
  col_17?: string;
  VISA?: string;
  "DISNAKR ID"?: string;
  MEDICAL?: string;
  SKCK?: string;
  KUMHAM?: string;
  DEPLU?: string;
  EC?: string;
  "STAMP VISA"?: string;
  "OVERSEAS ID"?: string;
  TICEKT?: string;
  col_30?: string;
  col_31?: string;
  col_32?: string;
}


const ApplicantPage = () => {
  const { user, loading: userLoading } = useUser();

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const sheetName = user?.jobName;
  const applicantId = user?.progressNumber?.toString();

  useEffect(() => {
    const fetchApplicant = async () => {
      if (!sheetName || !applicantId) {
        setLoading(false);
        return;
      }

      try {
        const response = await API.get(`/google-sheet/${sheetName}/${applicantId}`);
        if (!response.data?.error) {
          setApplicant(response.data);
        }
      } catch (error) {
        console.error('Fetch applicant error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchApplicant();
    }
  }, [userLoading, sheetName, applicantId]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        <LoadingAnimation />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} className="mr-1" />
              Back to Applicants
            </button>
            <div className="text-right">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Applicant Status Dashboard
              </h1>
              <p className="text-gray-600 mt-1 flex items-center justify-end">
                <Info size={16} className="mr-1 text-gray-500" />
                {user?.name || 'Unknown'}
              </p>
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <ApplicantProfileCard applicant={applicant} />

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ApplicationStatusSection applicant={applicant} />
          </div>
          <div>
            <ApplicationDetailsCard applicant={applicant} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-2 md:mb-0">
              Last updated:{' '}
              {new Date().toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ApplicantPage;
