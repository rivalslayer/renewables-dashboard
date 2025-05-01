import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  TextField,
  InputAdornment,
  Tooltip,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppContext } from '../../context/AppContext';

type SortableField = 'time_stamp' | 'resolution_time_stamp' | 'category' | 'code';
type ColumnId = SortableField | 'device' | 'duration' | 'description';

interface HeadCell {
  id: ColumnId;
  label: string;
  numeric: boolean;
  sortable: boolean;
}

const headCells: HeadCell[] = [
  { id: 'device', label: 'Device', numeric: false, sortable: false },
  { id: 'time_stamp', label: 'Start Time', numeric: false, sortable: true },
  { id: 'resolution_time_stamp', label: 'Resolution Time', numeric: false, sortable: true },
  { id: 'duration', label: 'Duration', numeric: false, sortable: false },
  { id: 'category', label: 'Category', numeric: false, sortable: true },
  { id: 'code', label: 'Alarm Code', numeric: true, sortable: true },
  { id: 'description', label: 'Description', numeric: false, sortable: false },
];

const formatDate = (dateString: string) => {
  try {
    // Remove the +00 timezone and replace space with T for ISO format
    const isoDate = dateString.replace('+00', 'Z').replace(' ', 'T');
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

const formatDuration = (durationSeconds: number) => {
  try {
    // Validate input
    if (typeof durationSeconds !== 'number' || isNaN(durationSeconds) || durationSeconds <= 0) {
      return '0h 0m 0s';
    }

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = Math.floor(durationSeconds % 60);
    
    // Only show non-zero values
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
    
    return parts.join(' ');
  } catch (error) {
    console.error('Error formatting duration:', error);
    return 'Invalid duration';
  }
};

const DataTable: React.FC = () => {
  const { alarms, filters, devices } = useAppContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [orderBy, setOrderBy] = useState<SortableField>('time_stamp');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize device lookup map for faster access
  const deviceMap = useMemo(() => {
    const map = new Map<number, { device_name: string; asset: string }>();
    devices.forEach(device => {
      map.set(device.id, { device_name: device.device_name, asset: device.asset });
    });
    return map;
  }, [devices]);

  // Memoize filtered alarms
  const filteredAlarms = useMemo(() => {
    return alarms.filter(alarm => {
      const device = deviceMap.get(alarm.device_id);
      if (!device) return false;

      // Filter by location
      if (filters.location && device.asset !== filters.location) {
        return false;
      }

      // Filter by device
      if (filters.device && device.device_name !== filters.device) {
        return false;
      }

      return true;
    });
  }, [alarms, filters, deviceMap]);

  // Memoize searched alarms
  const searchedAlarms = useMemo(() => {
    if (!searchTerm) return filteredAlarms;
    
    const term = searchTerm.toLowerCase();
    return filteredAlarms.filter(alarm => 
      alarm.description.toLowerCase().includes(term) ||
      alarm.category.toLowerCase().includes(term) ||
      alarm.code.toString().toLowerCase().includes(term)
    );
  }, [filteredAlarms, searchTerm]);

  // Memoize sorted alarms
  const sortedAlarms = useMemo(() => {
    return [...searchedAlarms].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];
      
      if (orderBy === 'time_stamp' || orderBy === 'resolution_time_stamp') {
        const aDate = new Date((aValue as string).replace('+00', 'Z').replace(' ', 'T'));
        const bDate = new Date((bValue as string).replace('+00', 'Z').replace(' ', 'T'));
        return order === 'asc' 
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : 1;
      }
      return aValue > bValue ? -1 : 1;
    });
  }, [searchedAlarms, orderBy, order]);

  // Memoize paginated alarms
  const paginatedAlarms = useMemo(() => {
    return sortedAlarms.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedAlarms, page, rowsPerPage]);

  const handleRequestSort = (property: SortableField) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Memoize device name lookup
  const getDeviceName = (deviceId: number) => {
    const device = deviceMap.get(deviceId);
    return device ? `${device.device_name} (${device.asset})` : `Device ${deviceId}`;
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search alarms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'right' : 'left'}
                  sortDirection={headCell.sortable && orderBy === headCell.id ? order : false}
                >
                  {headCell.sortable ? (
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : 'asc'}
                      onClick={() => handleRequestSort(headCell.id as SortableField)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  ) : (
                    headCell.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAlarms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headCells.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No alarms found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedAlarms.map((alarm) => (
                <TableRow key={alarm.id} hover>
                  <TableCell>{getDeviceName(alarm.device_id)}</TableCell>
                  <TableCell>{formatDate(alarm.time_stamp)}</TableCell>
                  <TableCell>{formatDate(alarm.resolution_time_stamp)}</TableCell>
                  <TableCell>{formatDuration(alarm.duration_seconds)}</TableCell>
                  <TableCell sx={{ width: '120px' }}>{alarm.category}</TableCell>
                  <TableCell align="right" sx={{ width: '100px' }}>{alarm.code}</TableCell>
                  <TableCell>
                    <Tooltip title={alarm.description}>
                      <Box sx={{ maxWidth: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {alarm.description}
                      </Box>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedAlarms.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default DataTable; 