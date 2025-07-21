import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { Chip, Skeleton, Stack } from '@mui/material';
import {
  CalendarBlank,
  Clock,
  CheckCircle,
  WarningCircle,
  XCircle,
  Info,
} from 'phosphor-react';
import dayjs from 'dayjs';

interface Attendance {
  id: number;
  date: string;
  time: string;
  method: string;
  status: 'present' | 'late' | 'absent' | 'excused' | string;
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present':
      return <CheckCircle size={18} />;
    case 'late':
      return <WarningCircle size={18} />;
    case 'absent':
      return <XCircle size={18} />;
    case 'excused':
      return <Info size={18} />;
    default:
      return undefined;
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'present':
      return 'success';
    case 'late':
      return 'warning';
    case 'absent':
      return 'error';
    case 'excused':
      return 'info';
    default:
      return 'default';
  }
};

export default function AttendanceTable({
  loading,
  data,
  total,
  paginationModel,
  onChangePagination,
}: {
  loading: boolean;
  data: Attendance[];
  total: number;
  paginationModel: GridPaginationModel;
  onChangePagination: (model: GridPaginationModel) => void;
}) {
  if (loading) {
    return (
      <Stack spacing={1}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={50} variant="rounded" />
        ))}
      </Stack>
    );
  }

  return (
    <DataGrid
      autoHeight
      rows={data.map((item) => ({
        id: item.id,
        date: dayjs(item.date).format('DD MMM YYYY'),
        time: dayjs(item.time).format('HH:mm'),
        method: item.method,
        status: item.status,
      }))}
      columns={[
        {
          field: 'date',
          headerName: 'Date',
          flex: 1,
          renderCell: (params) => (
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarBlank size={16} />
              <span>{params.value}</span>
            </Stack>
          ),
        },
        {
          field: 'time',
          headerName: 'Time',
          flex: 1,
          renderCell: (params) => (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Clock size={16} />
              <span>{params.value}</span>
            </Stack>
          ),
        },
        { field: 'method', headerName: 'Method', flex: 1 },
        {
          field: 'status',
          headerName: 'Status',
          flex: 1,
          renderCell: (params) => {
            const icon = getStatusIcon(params.value);
            return (
              <Chip
                label={params.value}
                {...(icon && { icon })}
                color={getStatusColor(params.value)}
                size="small"
                variant="outlined"
              />
            );
          },
        },
      ]}
      rowCount={total}
      paginationMode="server"
      paginationModel={paginationModel}
      onPaginationModelChange={onChangePagination}
      pageSizeOptions={[5, 10, 25]}
      disableRowSelectionOnClick
      sx={{ borderRadius: 2 }}
    />
  );
}
