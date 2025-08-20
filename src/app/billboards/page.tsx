'use client';

import React, { useEffect, useState } from 'react';
import API from '@/lib/AxioClient';
import { formatDate } from '@/lib/formatdate';
import VisaStatusTable from './table';

type AlertData = {
  sheet: string;
  name: string;
  passport: string;
  visaExpired: string | null;
  pk: string | null;
  daysToVisaExp: number | null;
  daysToPK: number | null;
};

export default function QueueDisplay() {
  const [data, setData] = useState<AlertData[]>([]);
  const [pushing, setPushing] = useState<string[]>([]);

  useEffect(() => {
    API.get('/google-sheet/alerts')
      .then(res => setData(res.data.data))
      .catch(err => console.error('Error fetching data', err));
  }, []);

  const getStatusColor = (days: number | null) => {
    if (days === null) return 'bg-slate-400';
    if (days <= 7) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (days <= 30) return 'bg-gradient-to-r from-amber-500 to-yellow-500';
    return 'bg-gradient-to-r from-emerald-500 to-green-500';
  };

  const getStatusIcon = (days: number | null) => {
    if (days === null) return '⚪';
    if (days <= 7) return '🔴';
    if (days <= 30) return '🟡';
    return '🟢';
  };

  const handlePushStatus = async (item: AlertData) => {
    const id = `${item.name}-${item.passport}`;
    if (pushing.includes(id)) return;

    setPushing(prev => [...prev, id]);

    try {
      await API.post('/google-sheet/visa-status', {
        sheet: item.sheet,
        name: item.name,
        passport: item.passport,
        visaExpired: item.visaExpired,
        pk: item.pk,
      });
      alert(`✅ Data pushed for ${item.name}`);
    } catch (err) {
      console.error('Error pushing data:', err);
      alert(`❌ Failed to push ${item.name}`);
    } finally {
      setPushing(prev => prev.filter(x => x !== id));
    }
  };

  const cardSize = "text-sm lg:text-base xl:text-lg";
  const iconSize = "w-6 h-6 lg:w-8 lg:h-8";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 py-8 px-4 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Queue Display
            </h1>
          </div>
          <p className="text-slate-400 text-lg lg:text-xl">Manage visa and permit status efficiently</p>
          <div className="mt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-lg text-slate-300 inline-block">
              Total Records: <span className="font-semibold text-white">{data.length}</span>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 max-w-full mx-auto">
          {data.map((item, idx) => {
            const id = `${item.name}-${item.passport}`;
            const isPushing = pushing.includes(id);

            return (
              <div
                key={idx}
                className={`group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-blue-500/20 ${isPushing ? 'animate-pulse' : ''}`}
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur"></div>

                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h2 className={`${cardSize} font-bold text-white mb-1 group-hover:text-blue-300 transition-colors`}>
                        {item.name}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 bg-blue-400 rounded-full"></span>
                        <span className="text-sm text-slate-300 font-medium">{item.sheet}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: '🛂', label: 'Passport', value: item.passport },
                      { icon: '📅', label: 'Visa Expiry', value: item.visaExpired ? new Date(item.visaExpired).toLocaleDateString() : 'Not Set' },
                      { icon: '📋', label: 'PK Status', value: item.pk ? formatDate(item.pk, "long") : "Not Available" }
                    ].map((info, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`${iconSize} bg-white/20 rounded-lg flex items-center justify-center`}>
                          <span className="text-sm">{info.icon}</span>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">{info.label}</p>
                          <p className={`${cardSize} font-semibold text-white`}>{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {[
                      { type: 'Visa', days: item.daysToVisaExp },
                      { type: 'PK', days: item.daysToPK }
                    ].map((status, i) => (
                      <div key={i} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white shadow-lg ${getStatusColor(status.days)}`}>
                        <span>{getStatusIcon(status.days)}</span>
                        <span>{status.type}: {status.days !== null ? `${status.days} days` : 'N/A'}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handlePushStatus(item)}
                    disabled={isPushing}
                    className={`w-full py-4 rounded-xl text-sm font-semibold transition-all duration-300 transform ${isPushing
                        ? 'bg-slate-600 cursor-not-allowed text-slate-300'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                  >
                    {isPushing ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span>📤</span>
                        <span>Confirm</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

         {data.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-8 bg-white/10 backdrop-blur-sm rounded-3xl">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Data Available</h3>
              <p className="text-slate-400 text-lg">Queue is empty. New records will appear here automatically.</p>
            </div>
          </div>
        )}
      </div>

        <div className="mt-16 relative z-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Detailed Table View
          </h2>
          <VisaStatusTable />
        </div>       
    </div>
  );
}