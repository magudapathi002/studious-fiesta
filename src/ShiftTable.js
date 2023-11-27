import React, { useEffect, useState } from "react";
import axios from "axios";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Box,
} from "@mui/material";
import "./App.css"
const ShiftTable = () => {
  const [rowData, setRowData] = useState([]);
  const [selectedShift, setSelectedShift] = useState({});
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isNewShiftDialogOpen, setNewShiftDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://655332195449cfda0f2e4d12.mockapi.io/shift');
        setRowData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const columnDefs = [
    {
      headerName: 'Shift Name',
      field: 'shiftName',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'Start Time',
      field: 'shiftStart',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'End Time',
      field: 'shiftEnd',
      filter: 'agTextColumnFilter',
      floatingFilter: true,
    },
    {
      headerName: 'Actions',
      cellRenderer: (params) => (
        <div>
          <Button onClick={() => handleEdit(params.data)}>Edit</Button>
        </div>
      ),
    },
  ];

  const handleEdit = (shift) => {
    setSelectedShift({ ...shift });
    setEditDialogOpen(true);
  };

  const handleNewShift = () => {
    setSelectedShift({});
    setNewShiftDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
  };

  const handleNewShiftDialogClose = () => {
    setNewShiftDialogOpen(false);
  };

  const handleSaveChanges = async () => {
    try {
      const apiUrl = selectedShift
        ? `https://655332195449cfda0f2e4d12.mockapi.io/shift/${selectedShift.id}`
        : 'https://655332195449cfda0f2e4d12.mockapi.io/shift';

      await axios[selectedShift ? 'put' : 'post'](apiUrl, selectedShift);

      const response = await axios.get('https://655332195449cfda0f2e4d12.mockapi.io/shift');
      setRowData(response.data);

      setEditDialogOpen(false);
      setNewShiftDialogOpen(false);
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <div style={{ width: '100%', marginBottom: '16px' }}>
        <Button variant="contained" color="primary" onClick={handleNewShift}>
          Add Shift
        </Button>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          domLayout="autoHeight"
          headerClass="header"
        />
      </div>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onClose={handleEditDialogClose}>
        {/* ... (unchanged) */}
      </Dialog>
      {/* New Shift Dialog */}
      <Dialog open={isNewShiftDialogOpen} onClose={handleNewShiftDialogClose}>
        <DialogTitle>Add New Shift</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the new shift information:
          </DialogContentText>
          <TextField
            sx={{ margin: '5px', marginTop: '10px' }}
            label="Shift Name"
            value={selectedShift ? selectedShift.shiftName : ''}
            onChange={(e) =>
              setSelectedShift({ ...selectedShift, shiftName: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="Start Time"
            sx={{ margin: '5px' }}
            value={selectedShift ? selectedShift.shiftStart : ''}
            onChange={(e) =>
              setSelectedShift({ ...selectedShift, shiftStart: e.target.value })
            }
            fullWidth
          />
          <TextField
            label="End Time"
            value={selectedShift ? selectedShift.shiftEnd : ''}
            sx={{ margin: '5px' }}
            onChange={(e) =>
              setSelectedShift({ ...selectedShift, shiftEnd: e.target.value })
            }
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewShiftDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save New Shift
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ShiftTable;