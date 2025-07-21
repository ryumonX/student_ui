import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Stack,
  Container,
} from '@mui/material';
import QRCode from 'react-qr-code';
import dayjs from 'dayjs';
import type { User } from '@/hook/useuserprofile'; // <- Import tipe User

export default function StudentHero({
  user,
  loading,
}: {
  user: User | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Typography align="center">User tidak ditemukan</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box
        sx={{
          backgroundColor: '#ffffff',
          border: '2px solid #d1d5db',
          borderRadius: 4,
          p: 2,
          boxShadow: '0 0 0 4px #1e3a8a',
          maxWidth: 400,
          mx: 'auto',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            backgroundColor: '#1e3a8a',
            color: '#ffffff',
            borderRadius: '8px 8px 0 0',
            py: 1,
            textAlign: 'center',
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Kartu Siswa
          </Typography>
          <Typography variant="body2">Delta Abadi Internasional</Typography>
        </Box>

        {/* QR Code */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={2}
          mb={1}
          p={1}
          sx={{
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: 2,
          }}
        >
          <QRCode value={user.qrcode ?? 'not-available'} size={120} />
        </Box>

        {/* Nama dan ID */}
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          sx={{ color: '#1e293b' }}
        >
          {user.name?.toUpperCase()}
        </Typography>
        <Typography
          variant="subtitle2"
          textAlign="center"
          gutterBottom
          color="text.secondary"
        >
          ID: WT{user.id?.toString().padStart(7, '0')}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Informasi Detail */}
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
          <Stack spacing={1} flex={1} minWidth={150}>
            <Typography variant="body2">
              <strong>Email:</strong> {user.email}
            </Typography>
            <Typography variant="body2">
              <strong>Role:</strong> {user.role}
            </Typography>
            <Typography variant="body2">
              <strong>Destination:</strong> {user.destinationCountry || 'N/A'}
            </Typography>
          </Stack>
          <Stack spacing={1} flex={1} minWidth={150}>
            <Typography variant="body2">
              <strong>Phone:</strong> {user.phoneNumber || 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Birth:</strong>{' '}
              {user.dateOfBirth
                ? dayjs(user.dateOfBirth).format('D MMMM YYYY')
                : 'N/A'}
            </Typography>
            <Typography variant="body2">
              <strong>Join date:</strong> 6/2025
            </Typography>
          </Stack>
        </Stack>

        <Typography
          variant="caption"
          display="block"
          mt={2}
          textAlign="center"
          sx={{ fontStyle: 'italic', color: '#6b7280' }}
        >
          KARTU IDENTITAS DIGITAL SISWA
        </Typography>
      </Box>
    </Container>
  );
}
