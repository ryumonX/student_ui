"use client";

import React, { useState } from "react";
import {
  Airplane,
  CaretDown,
  CheckCircle,
  CreditCard,
  CurrencyDollar,
  Envelope,
  File,
  Globe,
  Info,
  ListChecks,
  Note,
} from "phosphor-react";
import { Applicant } from "@/app/students/progress/page";

const formatDate = (dateStr: string) => {
  if (!dateStr) return "--";
  const isoParsed = new Date(dateStr);
  if (!isNaN(isoParsed.getTime())) {
    return isoParsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  const [day, month, year] = dateStr.split("-");
  if (day && month && year) {
    const parsed = new Date(`${year}-${month}-${day}`);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }
  return "--";
};

const ApplicationDetailsCard: React.FC<{ applicant: Applicant | null }> = ({ applicant }) => {
  const [expandedCard, setExpandedCard] = useState<string | null>("details");
  const [activeSection, setActiveSection] = useState<string>("passport");

  // if (!applicant) {
  //   return (
  //     <div className="p-6 bg-white border rounded-xl shadow-sm text-gray-500 text-center animate-pulse">
  //       Sedang memuat data aplikasi...
  //     </div>
  //   );
  // }

  const toggleCard = (id: string) => {
    setExpandedCard((prev) => (prev === id ? null : id));
  };

  const renderStatusBadge = (status: string | boolean | undefined | null): React.ReactNode => {
    if (status === undefined || status === null || status === "") {
      return (
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          --
        </span>
      );
    }
    if (typeof status === "boolean") {
      return status ? (
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
          <CheckCircle size={12} className="mr-1" /> Diterima
        </span>
      ) : (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          Belum Diterima
        </span>
      );
    }
    return (
      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
        {status}
      </span>
    );
  };

  const sectionComponents: Record<string, React.ReactNode> = {
    passport: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        <DetailCard label="Passport Number" value={applicant?.["PASSPORT NUMBER"] ?? "--"} icon={Airplane} />
        <DetailCard label="Issued Date" value={formatDate(applicant?.["Passport send"] ?? "")} />
        <DetailCard label="Expiry Date" value={formatDate(applicant?.["EXPIRED"] ?? "")} highlight="text-red-600" />
        <DetailCard label="Status" value={renderStatusBadge(applicant?.["Status"])} />
        <DetailCard label="Receipt Status" value={renderStatusBadge(applicant?.["Passport Diterima"])} />
        <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
          <Globe size={20} className="text-blue-600 mr-3 mt-1" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">Passport Instructions</h5>
            <p className="text-sm text-gray-700">
              Pastikan paspor masih berlaku minimal 6 bulan. Kirim fotokopi paspor ke email resmi LPK Dwitunggal.
            </p>
          </div>
        </div>
      </div>
    ),
    visa: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        <DetailCard label="Visa Type" value="Work Visa" icon={Airplane} />
        <DetailCard label="Issue Date" value={formatDate(applicant?.["Visa Date"] ?? "")} />
        <DetailCard label="Expiry Date" value={formatDate(applicant?.["Expired"] ?? "")} highlight="text-red-600" />
        <DetailCard label="Processing Status" value={renderStatusBadge(applicant?.["VISA"] ?? "In Progress")} />
        <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
          <Airplane size={20} className="text-blue-600 mr-3 mt-1" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">Visa Instructions</h5>
            <p className="text-sm text-gray-700">
              Proses visa membutuhkan waktu 7–14 hari kerja. Mohon pantau status melalui halaman ini secara berkala.
            </p>
          </div>
        </div>
      </div>
    ),
    payment: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        <DetailCard label="Down Payment" value={applicant?.["DP"] ?? "Belum ada"} icon={CurrencyDollar} highlight={applicant?.["DP"] ? "text-green-600" : "text-yellow-600"} />
        <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
          <CreditCard size={20} className="text-blue-600 mr-3 mt-1" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">Payment Instructions</h5>
            <p className="text-sm text-gray-700">
              Transfer ke rekening BCA 1234567890 (a.n. PT. Applicant Processing).
              Cantumkan ID pendaftar di kolom deskripsi transfer.
            </p>
          </div>
        </div>
      </div>
    ),
    info: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
        <DetailCard label="EC/PK" value={formatDate(applicant?.["EC/PK"] ?? "")} />
        <DetailCard label="Priority" value={applicant?.["KET."] ?? "--"} highlight="text-indigo-600" />
        <DetailCard label="Sponsor" value={applicant?.["SPONSOR"] ?? "--"} highlight="text-purple-600" />
        <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start">
          <Info size={20} className="text-blue-600 mr-3 mt-1" />
          <div>
            <h5 className="font-medium text-blue-800 mb-1">Additional Information</h5>
            <p className="text-sm text-gray-700">
              Jika ada data tambahan yang ingin dilampirkan, silakan hubungi admin.
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
      <div
        className="p-5 flex justify-between items-center cursor-pointer bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100"
        onClick={() => toggleCard("details")}
      >
        <div className="flex items-center">
          <div className="bg-indigo-100 p-2 rounded-lg mr-3">
            <ListChecks size={24} className="text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Application Details</h3>
            <p className="text-sm text-gray-500">View all applicant information</p>
          </div>
        </div>
        <CaretDown
          size={20}
          weight="bold"
          className={`text-indigo-600 transition-transform duration-300 ${expandedCard === "details" ? "rotate-180" : ""}`}
        />
      </div>

      {expandedCard === "details" && (
        <div className="p-5 space-y-8 animate-fadeIn">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center mb-3">
              <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                <Note size={20} className="text-indigo-600" />
              </div>
              <h4 className="text-md font-semibold text-gray-800">Offer Letter</h4>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-lg shadow-sm">
              <div>
                <div className="font-medium text-gray-900">{formatDate(applicant?.["OFFER LETTER Received"] ?? "")}</div>
                <div className="text-sm text-gray-600">Send: {formatDate(applicant?.["Send"] ?? "")}</div>
              </div>
              <span className="mt-3 md:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium inline-flex items-center">
                <File size={16} className="mr-2" />
                Offer Letter Sent
              </span>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 overflow-x-auto">
              {[
                { id: "passport", icon: Envelope, label: "Passport" },
                { id: "visa", icon: Airplane, label: "Visa" },
                { id: "payment", icon: CreditCard, label: "Payment" },
                { id: "info", icon: Info, label: "Additional Info" },
              ].map((tab) => (
                <li key={tab.id} className="mr-2">
                  <button
                    onClick={() => setActiveSection(tab.id)}
                    className={`inline-flex items-center p-4 border-b-2 rounded-t-lg group ${activeSection === tab.id ? "text-indigo-600 border-indigo-600" : "border-transparent hover:text-gray-600 hover:border-gray-300"}`}
                  >
                    <tab.icon size={18} className={`mr-2 ${activeSection === tab.id ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"}`} />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-h-[300px]">
            {sectionComponents[activeSection]}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailCard: React.FC<{
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
  highlight?: string;
}> = ({ label, value, icon: Icon, highlight = "text-gray-800" }) => (
  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <div className="text-xs text-gray-500 mb-1">{label}</div>
        <div className={`font-medium ${highlight}`}>{value}</div>
      </div>
      {Icon && (
        <div className="bg-indigo-100 p-2 rounded-lg">
          <Icon size={18} className="text-indigo-600" />
        </div>
      )}
    </div>
  </div>
);

export default ApplicationDetailsCard;
