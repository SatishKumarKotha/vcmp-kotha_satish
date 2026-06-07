import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getProfileService,
  updateProfileService,
  changePasswordService
} from "../../services/auth.service";

const Profile = () => {

  const [name,
    setName] =
    useState("");

  const [email,
    setEmail] =
    useState("");

  const [oldPassword,
    setOldPassword] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  useEffect(() => {

    loadProfile();

  }, []);

  const loadProfile =
    async () => {

      const response =
        await getProfileService();

      const user =
        response.VendorProfile;

      setName(
        user.name
      );

      setEmail(
        user.email
      );

    };

  const handleProfileUpdate =
    async () => {

      await updateProfileService(
        name
      );

      alert(
        "Profile Updated"
      );

    };

  const handlePasswordChange =
    async () => {

      await changePasswordService(
        oldPassword,
        newPassword
      );

      alert(
        "Password Changed"
      );

      setOldPassword("");

      setNewPassword("");

    };

  return (

    <DashboardLayout>

      <Typography
        variant="h4"
        mb={3}
      >
        Profile
      </Typography>

      <Paper sx={{ p: 4 }}>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Email"
              value={email}
              disabled
            />

          </Grid>

          <Grid item xs={12}>

            <Button
              variant="contained"
              onClick={
                handleProfileUpdate
              }
            >
              Update Profile
            </Button>

          </Grid>

        </Grid>

      </Paper>

      <Paper
        sx={{
          p: 4,
          mt: 4
        }}
      >

        <Typography
          variant="h6"
          mb={3}
        >
          Change Password
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12}>

            <TextField
              fullWidth
              type="password"
              label="Old Password"
              value={oldPassword}
              onChange={(e) =>
                setOldPassword(
                  e.target.value
                )
              }
            />

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
            />

          </Grid>

          <Grid item xs={12}>

            <Button
              variant="contained"
              onClick={
                handlePasswordChange
              }
            >
              Change Password
            </Button>

          </Grid>

        </Grid>

      </Paper>

    </DashboardLayout>

  );

};

export default Profile;