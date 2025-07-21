'use client';
import React, { useState } from 'react';
import {
  ListChecks,
  Note,
  ArrowLeft,
} from 'phosphor-react';
import { Applicant } from '@/app/students/progress/page';

const ApplicationDetailsCard: React.FC<{ applicant: Applicant | null }> = ({ applicant }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>('details');

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
      <div
        className={`p-5 flex justify-between items-center cursor-pointer ${expandedCard === 'details' ? 'bg-indigo-50 border-b border-indigo-100' : ''}`}
        onClick={() => toggleCard('details')}
      >
        <h3 className="text-lg font-bold text-gray-800 flex items-center">
          <ListChecks size={20} className="text-indigo-600 mr-2" />
          Application Details
        </h3>
        <button className="text-indigo-600">
          <ArrowLeft size={20} weight="bold" className={`${expandedCard === 'details' ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {expandedCard === 'details' && (
        <div className="p-5 space-y-6">
          {/* Document Status */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Note size={16} className="mr-2 text-indigo-600" />
              Document Status
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <DetailCard label="VISA" value={applicant?.['VISA'] || '--'} />
              <DetailCard label="DISNAKR ID" value={applicant?.['DISNAKR ID'] || '--'} />
              <DetailCard label="MEDICAL" value={applicant?.['MEDICAL'] || '--'} />
              <DetailCard label="SKCK" value={applicant?.['SKCK'] || '--'} />
              <DetailCard label="KUMHAM" value={applicant?.['KUMHAM'] || '--'} />
              <DetailCard label="DEPLU" value={applicant?.['DEPLU'] || '--'} />
              <DetailCard label="EC" value={applicant?.['EC'] || '--'} />
              <DetailCard label="STAMP VISA" value={applicant?.['STAMP VISA'] || '--'} />
              <DetailCard label="OVERSEAS ID" value={applicant?.['OVERSEAS ID'] || '--'} />
              <DetailCard label="TICEKT" value={applicant?.['TICEKT'] || '--'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetailsCard;

// Reusable DetailCard component
const DetailCard: React.FC<{ label: string; value: React.ReactNode; highlight?: string }> = ({
  label,
  value,
  highlight = 'text-gray-800',
}) => (
  <div className="bg-gray-50 p-3 rounded-lg">
    <div className="text-xs text-gray-500">{label}</div>
    <div className={`font-medium ${highlight}`}>{value}</div>
  </div>
);
