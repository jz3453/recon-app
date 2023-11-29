import React, { useEffect } from 'react';
import './page.css';
import { MenuItem, Select } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Be Vietnam Pro, sans-serif',
    fontSize: 11,
  },
  palette: {
    text: {
      primary: '#7A7A7A', // Change 'primary' text color to your desired color
    },
  },
});

const MultipleSelectDropdown = ({ options, handleChange, value }) => {
  return (
    <ThemeProvider theme={theme}>
      <Select
        multiple
        defaultValue={null}
        value={value}
        onChange={handleChange}
        sx={{
          width: '100%',
          height: '30px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {
          options.map((option, index) => (
            <MenuItem value={option}>{option}</MenuItem>
          ))
        }
      </Select>
    </ThemeProvider>
  );
}
export default MultipleSelectDropdown;