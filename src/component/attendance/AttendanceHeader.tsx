'use client';
import { ArrowLeft, ChartPieSlice, IdentificationBadge, ClockCounterClockwise } from 'phosphor-react';
import { Box, Button, Stack, Typography, IconButton, Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  avatar?: string;
}

export default function AttendanceHeader({ user }: { user: User | null }) {

  const router = useRouter();

  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft size={18} />}
          onClick={() => router.push('/students')}
          sx={{ borderRadius: 2, textTransform: 'none' }}
        >
          Back to Students
        </Button>
        <Stack direction="row" spacing={1}>
          <IconButton><ChartPieSlice size={20} /></IconButton>
          <IconButton><IdentificationBadge size={20} /></IconButton>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1.5, bgcolor: '#eef2ff', borderRadius: 2 }}>
            <ClockCounterClockwise size={28} />
          </Box>
          <Box>
            <Typography variant="h5" fontWeight={700}>Attendance History</Typography>
            {user && (
              <Typography variant="body2" color="text.secondary">
                Detailed records for {user.name}
              </Typography>
            )}
          </Box>
        </Stack>

        {user && (
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar src={user.avatar} />
            <Box>
              <Typography fontWeight={600}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
