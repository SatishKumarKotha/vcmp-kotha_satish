import {
  AppBar,
  Toolbar,
  Typography,
  Button
} from "@mui/material";

const Navbar = () => {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const logout = () => {

    localStorage.clear();

    window.location.href = "/";

  };

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
    >
      <Toolbar>

        <Typography
          sx={{ flexGrow: 1 }}
        >
          Vendor Contract Management
        </Typography>

        <Typography
          sx={{ mr: 2 }}
        >
          {user?.name}
        </Typography>

        <Button
          color="error"
          onClick={logout}
        >
          Logout
        </Button>

      </Toolbar>
    </AppBar>
  );

};

export default Navbar;