// import { useControl } from '@src/hooks/useControl';
import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import * as React from 'react';
import type { TableControlConfig } from '@extension/shared';

export default function TableControl(controlConfig: TableControlConfig) {
  const { id, columns, data } = controlConfig;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paged = React.useMemo(() => {
    const start = page * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const renderCell = (value: unknown) => {
    if (value == null) return '';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 420 }}>
        <MuiTable stickyHeader size="small" aria-label={`table-${id}`}>
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key} sx={{ fontWeight: 600 }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No data
                </TableCell>
              </TableRow>
            ) : (
              paged.map((row, idx) => (
                <TableRow hover key={`${id}-${page}-${idx}`}>
                  {columns.map(col => (
                    <TableCell key={col.key}>{renderCell((row as never)[col.key])}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </Paper>
  );
}
