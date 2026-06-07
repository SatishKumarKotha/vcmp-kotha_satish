import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from "@mui/material";

import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#0F172A",
        color: "white"
      }}
    >
      <Typography
        variant="h6"
        sx={{
          p: 3,
          fontWeight: "bold"
        }}
      >
        Finvesco
      </Typography>

      <List>

        <ListItemButton
          component={Link}
          to="/dashboard"
        >
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/vendors"
        >
          <ListItemText primary="Vendors" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/contracts"
        >
          <ListItemText primary="Contracts" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/purchase-orders"
        >
          <ListItemText primary="Purchase Orders" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/invoices"
        >
          <ListItemText primary="Invoices" />
        </ListItemButton>

         <ListItemButton
          component={Link}
          to="/users"
        >
          <ListItemText primary="Users" />
        </ListItemButton>

             <ListItemButton
          component={Link}
          to="/audit-logs"
        >
          <ListItemText primary="Audit Logs" />
        </ListItemButton>

                     <ListItemButton
          component={Link}
          to="/profile"
        >
          <ListItemText primary="Profile" />
        </ListItemButton>
        
          <ListItemButton
          component={Link}
          to="/reports"
        >
          <ListItemText primary="Reports" />
        </ListItemButton>

   <ListItemButton
          component={Link}
          to="/notifications"
        >
          <ListItemText primary="Notifications" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;