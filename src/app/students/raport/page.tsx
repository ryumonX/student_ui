'use client';

import React, { useEffect, useState } from 'react';
import API from '@/lib/AxioClient';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography, CircularProgress, Paper, TablePagination,
  Box, Divider, Button, Stack, Chip, Avatar, Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  DownloadSimple, ArrowLeft, Student,
  BookOpen, ChartBar, Star, GraduationCap
} from 'phosphor-react';

interface Grade {
  id: number;
  score: number;
  semester: number;
  remarks: 'Excellent' | 'Good' | 'Needs Improvement' | string;
  subject: {
    name: string;
  };
  teacher?: {
    user?: {
      name: string;
    };
  };
}


const getGradeColor = (score: number) => {
  if (score >= 90) return '#4caf50';
  if (score >= 75) return '#ff9800';
  return '#f44336';
};

export default function RaportPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.id);
    }
  }, []);

  useEffect(() => {
    if (userId !== null) {
      setLoading(true);
      API.get(`/grades/user/${userId}?page=${page + 1}&limit=${limit}`)
        .then((res) => {
          setGrades(res.data.data);
          setTotal(res.data.meta.total);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, page, limit]);

  // ✅ Pindahkan ke atas sebelum dipakai
  const averageScore = grades.length > 0
    ? (grades.reduce((sum: number, g) => sum + g.score, 0) / grades.length).toFixed(2)
    : '0';

  const highestScore = grades.length > 0
    ? Math.max(...grades.map((g) => g.score))
    : 0;

  useEffect(() => {
    if (averageScore && grades.length > 0) {
      localStorage.setItem(
        'averageScore',
        JSON.stringify({
          value: averageScore,
          progress: parseFloat(averageScore),
        })
      );
    }
  }, [averageScore, grades.length]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePrint = () => window.print();

  const generatedDate = isClient ? new Date().toLocaleDateString() : '';

  return (
    <Paper
      elevation={6}
      sx={{
        p: 4,
        maxWidth: 1100,
        mx: { xs: 2, sm: 'auto' },
        mt: 6,
        borderRadius: 4,
        backgroundColor: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        '@media print': {
          boxShadow: 'none',
          border: 'none',
          maxWidth: '100%',
          p: 2,
        },
      }}
    >
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        mb={3}
        gap={2}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}>
            <Student size={28} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={700} fontSize={{ xs: '1.25rem', sm: '1.5rem' }} color="primary.dark">
              📘 Student Report Card
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Detailed academic performance overview
            </Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={18} />}
            onClick={() => router.push('/students')}
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Back
          </Button>
          <Tooltip title="Download Report">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadSimple size={18} />}
              onClick={handlePrint}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' }
              }}
            >
              Print / PDF
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Summary Cards */}
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4,
        '@media print': { display: 'none' }
      }}>
        {[{
          icon: <BookOpen size={24} color="#1976d2" />,
          bg: '#e3f2fd',
          title: 'Total Subjects',
          value: grades.length
        }, {
          icon: <ChartBar size={24} color="#4caf50" />,
          bg: '#e8f5e9',
          title: 'Average Score',
          value: averageScore
        }, {
          icon: <Star size={24} color="#ff9800" />,
          bg: '#fff3e0',
          title: 'Highest Score',
          value: highestScore
        }].map((item, idx) => (
          <Paper key={idx} sx={{
            p: 2, flex: 1, minWidth: { xs: '100%', sm: 200 },
            borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2
          }}>
            <Avatar sx={{ bgcolor: item.bg }}>{item.icon}</Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">{item.title}</Typography>
              <Typography variant="h6" fontWeight={700}>{item.value}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Title Print */}
      <Box textAlign="center" sx={{
        display: 'none',
        '@media print': {
          display: 'block',
          mb: 3,
        },
      }}>
        <Stack direction="row" justifyContent="center" alignItems="center" gap={2} mb={2}>
          <GraduationCap size={32} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            OFFICIAL STUDENT REPORT CARD
          </Typography>
          <GraduationCap size={32} />
        </Stack>
        <Typography variant="body2" color="text.secondary">DELTA ABADI INTERNASIONAL SCHOOL</Typography>
        <Divider sx={{ mt: 2, mb: 3 }} />
      </Box>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Loading report data...</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ overflowX: 'auto', border: '1px solid #e0e0e0', borderRadius: 3, px: { xs: 1, sm: 0 } }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f7fa' }}>
                  {['Subject', 'Teacher', 'Semester', 'Score', 'Remarks'].map((text, idx) => (
                    <TableCell key={idx} sx={{ fontWeight: 'bold', color: '#2c3e50', py: 2, fontSize: '0.95rem' }}>
                      {text}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.length > 0 ? grades.map((g: Grade, index: number) => (
                  <TableRow key={g.id} hover sx={{
                    backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff',
                    transition: 'background-color 0.3s',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                    '@media print': { backgroundColor: 'transparent !important' }
                  }}>
                    <TableCell sx={{ fontWeight: 500 }}>{g.subject.name}</TableCell>
                    <TableCell>{g.teacher?.user?.name || '-'}</TableCell>
                    <TableCell>
                      <Chip label={`Semester ${g.semester}`} size="small" sx={{ backgroundColor: '#e0f7fa', fontWeight: 500 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 42, height: 42, borderRadius: '50%', backgroundColor: '#f5f5f5',
                        border: `2px solid ${getGradeColor(g.score)}`, fontWeight: 700, color: getGradeColor(g.score)
                      }}>
                        {g.score}
                      </Box>
                    </TableCell>
                    <TableCell sx={{
                      color: g.remarks === 'Excellent' ? '#4caf50'
                        : g.remarks === 'Good' ? '#ff9800' : '#f44336',
                      fontWeight: 500
                    }}>
                      {g.remarks}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 3 }}>
                        <BookOpen size={48} color="#bdbdbd" />
                        <Typography variant="body1" color="text.secondary" mt={1}>
                          No grades available for this student
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>

          {/* Chart */}
          {grades.length > 0 && (
            <Box sx={{
              mt: 3, p: 2, backgroundColor: '#f8f9fa', borderRadius: 3,
              display: 'flex', flexWrap: 'wrap', gap: 2,
              '@media print': { display: 'none' }
            }}>
              <Typography variant="body1" fontWeight={500} sx={{ width: '100%' }}>
                Performance Distribution:
              </Typography>
              {grades.map((g) => (
                <Tooltip key={g.id} title={`${g.subject.name}: ${g.score}`} arrow>
                  <Box sx={{
                    flex: 1, minWidth: { xs: '100%', sm: 100 }, textAlign: 'center'
                  }}>
                    <Typography variant="body2" fontWeight={500} mb={0.5}>
                      {g.subject.name.substring(0, 12)}{g.subject.name.length > 12 ? '...' : ''}
                    </Typography>
                    <Box sx={{
                      height: 8, borderRadius: 4, backgroundColor: '#e0e0e0', overflow: 'hidden'
                    }}>
                      <Box sx={{
                        height: '100%', width: `${g.score}%`,
                        backgroundColor: getGradeColor(g.score), borderRadius: 4
                      }} />
                    </Box>
                    <Typography variant="body2" mt={0.5}>{g.score}%</Typography>
                  </Box>
                </Tooltip>
              ))}
            </Box>
          )}

          {/* Pagination */}
          <Box
            display="flex"
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            mt={3}
            gap={2}
            sx={{ '@media print': { display: 'none' } }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {grades.length} of {total} records
            </Typography>
            <TablePagination
              component="div"
              count={total}
              page={page}
              rowsPerPage={limit}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 20]}
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Footer Print */}
      {isClient && generatedDate && (
        <Box sx={{
          mt: 4,
          display: 'none',
          '@media print': {
            display: 'block',
            textAlign: 'center',
            pt: 4
          }
        }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body2">
            Official Academic Transcript • Generated on {generatedDate}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Delta Abadi Internasional School • www.deltaabadi.edu
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
