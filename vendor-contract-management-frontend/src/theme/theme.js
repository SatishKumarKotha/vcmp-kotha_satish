import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0F172A"
    },

    secondary: {
      main: "#2563EB"
    },

    success: {
      main: "#059669"
    },

    warning: {
      main: "#D97706"
    },

    background: {
      default: "#F8FAFC"
    }
  },

  typography: {
  fontFamily: "Arial, sans-serif"
  }
});

export default theme;