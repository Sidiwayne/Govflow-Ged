import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid';
import { Courrier } from '../types/courrier';

interface CourriersTableProps {
  courriers: Courrier[];
  height?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  showActions?: boolean;
  onViewDetails?: (courrier: Courrier) => void;
  onEdit?: (courrier: Courrier) => void;
  onArchive?: (courrier: Courrier) => void;
}

const CourriersTable: React.FC<CourriersTableProps> = ({
  courriers,
  height = 600,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  showActions = true,
  onViewDetails,
  onEdit,
  onArchive,
}) => {
  const columns: GridColDef[] = [
    { field: 'number', headerName: 'Numéro', width: 150 },
    { 
      field: 'metadata.expediteur', 
      headerName: 'Expéditeur', 
      width: 250, 
      valueGetter: (_, row: Courrier) => row.metadata.expediteur
    },
    { 
      field: 'metadata.objet', 
      headerName: 'Objet', 
      width: 300, 
      valueGetter: (_, row: Courrier) => row.metadata.objet
    },
    { 
      field: 'metadata.dateReception', 
      headerName: 'Date Réception', 
      width: 150,
      valueFormatter: (_, row: Courrier) => new Date(row.metadata.dateReception).toLocaleDateString('fr-FR')
    },
    { 
      field: 'status', 
      headerName: 'Statut', 
      width: 120,
      renderCell: (params: GridRenderCellParams<Courrier>) => {
        const statusColors = {
          in_progress: 'info',
          closed: 'success',
          archived: 'default'
        };
        return (
          <Chip
            label={params.value === 'in_progress' ? 'En cours' : params.value === 'closed' ? 'Traité' : 'Archivé'}
            color={statusColors[params.value as keyof typeof statusColors] as any}
            size="small"
          />
        );
      }
    },
    { 
      field: 'metadata.priorite', 
      headerName: 'Priorité', 
      width: 120,
      renderCell: (params: GridRenderCellParams<Courrier>) => {
        const priorityColors = {
          basse: 'default',
          normale: 'primary',
          haute: 'warning',
          urgente: 'error'
        };
        return (
          <Chip
            label={params.row.metadata.priorite}
            color={priorityColors[params.row.metadata.priorite as keyof typeof priorityColors] as any}
            size="small"
          />
        );
      }
    },
    ...(showActions ? [{
      field: 'actions',
      type: 'actions' as const,
      headerName: 'Actions',
      width: 150,
      getActions: (params: { row: Courrier; }) => [
        ...(onViewDetails ? [
          <GridActionsCellItem
            key="view"
            icon={<Box component="span" sx={{ color: 'primary.main' }}>👁️</Box>}
            label="Voir détails"
            onClick={() => onViewDetails(params.row)}
          />
        ] : []),
        ...(onEdit ? [
          <GridActionsCellItem
            key="edit"
            icon={<Box component="span" sx={{ color: 'info.main' }}>✏️</Box>}
            label="Modifier"
            onClick={() => onEdit(params.row)}
          />
        ] : []),
        ...(onArchive ? [
          <GridActionsCellItem
            key="archive"
            icon={<Box component="span" sx={{ color: 'default.main' }}>📁</Box>}
            label="Archiver"
            onClick={() => onArchive(params.row)}
          />
        ] : []),
      ],
    }] : []),
  ];

  return (
    <Card>
      <CardContent>
        <Box sx={{ height }}>
          <DataGrid
            rows={courriers}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize },
              },
            }}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #e0e0e0',
              },
              "& .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              "& .MuiDataGrid-columnHeader:focus-within": {
                outline: "none !important",
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourriersTable;
