'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper } from '@mui/material';
import LoadingAnimation from '@/component/loading';

import AttendanceHeader from '@/component/attendance/AttendanceHeader';
import AttendanceSummary from '@/component/attendance/AttendanceSummary';
import AttendanceTable from '@/component/attendance/AttendanceTable';
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
}

export default function AttendanceHistoryPage() {
  const [mounted, setMounted] = useState(false);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) return;

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        const res = await API.get(`/attendances/history/${parsedUser.id}`);
        const data = res.data.attendance || [];

        setAttendances(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // Filter by status
  const statusFiltered = useMemo(() => {
    return statusFilter === 'all'
      ? attendances
      : attendances.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());
  }, [attendances, statusFilter]);

  // Filter by search term (date, time, method, status)
  const filteredData = useMemo(() => {
    return statusFiltered.filter((item) => {
      const keyword = searchTerm.toLowerCase();
      return (
        item.date.toLowerCase().includes(keyword) ||
        item.time.toLowerCase().includes(keyword) ||
        item.method.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword)
      );
    });
  }, [statusFiltered, searchTerm]);

  // Statistik berdasarkan hasil filter
  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter((a) => a.status.toLowerCase() === 'present').length;
    const late = filteredData.filter((a) => a.status.toLowerCase() === 'late').length;
    const absent = filteredData.filter((a) => a.status.toLowerCase() === 'absent').length;

    return {
      total,
      present,
      late,
      absent,
      presentPercentage: total ? Math.round((present / total) * 100) : 0,
      latePercentage: total ? Math.round((late / total) * 100) : 0,
      absentPercentage: total ? Math.round((absent / total) * 100) : 0,
    };
  }, [filteredData]);

  // Get data per page untuk pagination frontend
  const paginatedData = useMemo(() => {
    const start = paginationModel.page * paginationModel.pageSize;
    const end = start + paginationModel.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, paginationModel]);

  if (!mounted || loading || !user) return <LoadingAnimation />;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, my: 4 }}>
      <AttendanceHeader user={user} />

      <Paper elevation={2} sx={{ p: 4, borderRadius: 4 }}>
        <AttendanceSummary
          stats={stats}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <AttendanceTable
          loading={loading}
          data={paginatedData}
          total={filteredData.length}
          paginationModel={paginationModel}
          onChangePagination={setPaginationModel}
        />
      </Paper>
    </Box>
  );
}
