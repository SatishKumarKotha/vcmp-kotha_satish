import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getUserByIdService
} from "../../services/user.service";

const UserView = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [user,
    setUser] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser =
    async () => {

      try {

        const response =
          await getUserByIdService(
            id
          );

        setUser(
          response
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  if (loading) {

    return (

      <DashboardLayout>

        <Typography>
          Loading User...
        </Typography>

      </DashboardLayout>

    );

  }

  if (!user) {

    return (

      <DashboardLayout>

        <Typography
          color="error"
        >
          User not found
        </Typography>

      </DashboardLayout>

    );

  }

  return (

    <DashboardLayout>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          User Details
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              "/users"
            )
          }
        >
          Back
        </Button>

      </Box>

      <Paper
        sx={{
          p: 4
        }}
      >

        <Grid
          container
          spacing={3}
        >

          <Grid
            item
            xs={12}
            md={6}
          >

            <Typography>
              <strong>
                Name:
              </strong>{" "}
              {user.name}
            </Typography>

          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <Typography>
              <strong>
                Email:
              </strong>{" "}
              {user.email}
            </Typography>

          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <Typography>
              <strong>
                Role:
              </strong>{" "}
              {user.role}
            </Typography>

          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <Typography
              mb={1}
            >
              <strong>
                Status:
              </strong>
            </Typography>

            <Chip
              label={
                user.status
              }
              color={
                user.status ===
                "active"
                  ? "success"
                  : "error"
              }
            />

          </Grid>

          <Grid
            item
            xs={12}
            md={6}
          >

            <Typography>
              <strong>
                Created Date:
              </strong>{" "}
              {
                user.created_at
                  ?.split("T")[0]
              }
            </Typography>

          </Grid>

        </Grid>

      </Paper>

    </DashboardLayout>

  );

};

export default UserView;