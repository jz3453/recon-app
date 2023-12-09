import React from 'react';
import '../page.css';
import { MenuItem, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Be Vietnam Pro, sans-serif',
    fontSize: 10,
  },
  palette: {
    text: {
      primary: '#7A7A7A', // Change 'primary' text color to your desired color
    },
  },
});

const AppStatusDropdown = ({ handleChange, value }) => {
  const statusValue = value ? "Active" : "Archived";
  const textColor = (value) => {
    switch (value) {
      case 'Active':
        return '#00AF11';
      default:
        return '#7A7A7A';
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <Select
        value={statusValue}
        onChange={handleChange}
        className="custom-select"
        sx={{
          width: '80px',
          height: '20px',
          padding: '0px',
          '& .css-1d3z3hw-MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove border
          },
          '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
            color: textColor(statusValue),
            padding: '0px',
          },
          '& .css-1bqtci4-MuiSvgIcon-root-MuiSelect-icon': {
            color: textColor(statusValue),
          },               
        }}
      >
        {["Active", "Archived"].map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </ThemeProvider>
  );
};

export default AppStatusDropdown;