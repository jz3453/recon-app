import React from 'react';
import '../page.css';
import { statusOptions } from '../../constants/Constants';
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

const StatusDropdown = ({ handleChange, value }) => {
  const getColor = (value) => {
    switch (value) {
      case 'pending':
        return '#FEECC8';
      case 'interviewing':
        return '#EBEBFF';
      case 'shortlist':
        return '#D6F5FF';
      case 'extend-offer':
        return '#D6FFDA';
      case 'reject':
        return '#FFE8E8';
      default:
        return '#7A7A7A';
    }
  }

  const textColor = (value) => {
    switch (value) {
      case 'pending':
        return '#F5A300';
      case 'interviewing':
        return '#0000C8';
      case 'shortlist':
        return '#00B1EB';
      case 'extend-offer':
        return '#00AF11';
      case 'reject':
        return '#DE2020';
      default:
        return '#7A7A7A';
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <Select
        value={value}
        onChange={handleChange}
        className="custom-select"
        sx={{
          width: '100px',
          height: '20px',
          padding: '0px',
          backgroundColor: getColor(value),
          '& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input': {
            color: textColor(value),
          },
          '& .css-1bqtci4-MuiSvgIcon-root-MuiSelect-icon': {
            color: textColor(value),
          },               
        }}
      >
        {statusOptions.map((option, index) => (
          <MenuItem key={index} value={option.toLowerCase() === 'extend offer' ? 'extend-offer' : option.toLowerCase()}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </ThemeProvider>
  );
};

export default StatusDropdown;