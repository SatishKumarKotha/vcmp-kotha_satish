import {
  Box
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({
  children
}) => {

  return (
    <Box
      sx={{
        display: "flex"
      }}
    >

      <Sidebar />

      <Box
        sx={{
          flex: 1
        }}
      >

        <Navbar />

        <Box p={3}>
          {children}
        </Box>

      </Box>

    </Box>
  );

};

export default DashboardLayout;