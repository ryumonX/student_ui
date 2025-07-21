'use client';
import { TextField, Box, Stack, Typography, MenuItem, Paper, Divider } from '@mui/material';

interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
  presentPercentage: number;
  latePercentage: number;
  absentPercentage: number;
}

interface AttendanceSummaryProps {
  stats: AttendanceStats;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export default function AttendanceSummary({
  stats,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: AttendanceSummaryProps) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        backgroundColor: '#f8fafc',
        mb: 4,
      }}
    >
      {/* Filter Controls */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          label="Cari data absensi..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <TextField
          label="Filter Status"
          variant="outlined"
          size="small"
          select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <MenuItem value="all">Semua</MenuItem>
          <MenuItem value="present">Hadir</MenuItem>
          <MenuItem value="late">Terlambat</MenuItem>
          <MenuItem value="absent">Tidak Hadir</MenuItem>
        </TextField>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Statistik */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Statistik Absensi
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
          {/* Total */}
          <Box
            sx={{
              flex: 1,
              minWidth: 180,
              p: 2,
              borderRadius: 2,
              bgcolor: 'grey.200',
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Total Kehadiran:
            </Typography>
            <Typography variant="h6">{stats.total}</Typography>
          </Box>

          {/* Hadir */}
          <Box
            sx={{
              flex: 1,
              minWidth: 180,
              p: 2,
              borderRadius: 2,
              bgcolor: 'success.light',
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium" color="success.dark">
              Hadir:
            </Typography>
            <Typography variant="h6" color="success.dark">
              {stats.present} ({stats.presentPercentage}%)
            </Typography>
          </Box>

          {/* Terlambat */}
          <Box
            sx={{
              flex: 1,
              minWidth: 180,
              p: 2,
              borderRadius: 2,
              bgcolor: 'warning.light',
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium" color="warning.dark">
              Terlambat:
            </Typography>
            <Typography variant="h6" color="warning.dark">
              {stats.late} ({stats.latePercentage}%)
            </Typography>
          </Box>

          {/* Tidak Hadir */}
          <Box
            sx={{
              flex: 1,
              minWidth: 180,
              p: 2,
              borderRadius: 2,
              bgcolor: 'error.light',
              boxShadow: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium" color="error.dark">
              Tidak Hadir:
            </Typography>
            <Typography variant="h6" color="error.dark">
              {stats.absent} ({stats.absentPercentage}%)
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}
