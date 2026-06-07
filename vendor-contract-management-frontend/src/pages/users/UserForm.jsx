import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import {
  useState,
  useEffect
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  createUserService,
  updateUserService,
  getUserByIdService
} from "../../services/user.service";

const initialState = {
  name: "",
  email: "",
  password: "",
  role: "PROCUREMENT",
  status: "active"
};

const UserForm = () => {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const [formData,
    setFormData] =
    useState(initialState);

  const [loading,
    setLoading] =
    useState(false);

  const [error,
    setError] =
    useState("");

  useEffect(() => {

    if (id) {

      loadUser();

    }

  }, [id]);

  const loadUser =
    async () => {

      try {

        const user =
          await getUserByIdService(
            id
          );

        setFormData({
          name:
            user.name || "",

          email:
            user.email || "",

          password: "",

          role:
            user.role || "",

          status:
            user.status || "active"
        });

      } catch (error) {

        console.log(error);

      }

    };

  const handleChange =
    (e) => {

      const {
        name,
        value
      } = e.target;

      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (id) {

          await updateUserService(
            id,
            {
              name:
                formData.name,

              role:
                formData.role,

              status:
                formData.status
            }
          );

        } else {

          await createUserService(
            formData
          );

        }

        navigate("/users");

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Failed to save user"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <Box
      display="flex"
      justifyContent="center"
      mt={4}
    >

      <Paper
        sx={{
          p: 4,
          width: 700
        }}
      >

        <Typography
          variant="h5"
          mb={3}
        >
          {
            id
              ? "Edit User"
              : "Create User"
          }
        </Typography>

        {
          error && (

            <Typography
              color="error"
              mb={2}
            >
              {error}
            </Typography>

          )
        }

        <form
          onSubmit={handleSubmit}
        >

          <Grid
            container
            spacing={2}
          >

            <Grid
              item
              xs={12}
            >

              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

            </Grid>

            <Grid
              item
              xs={12}
            >

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!id}
              />

            </Grid>

            {
              !id && (

                <Grid
                  item
                  xs={12}
                >

                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                </Grid>

              )
            }

            <Grid
              item
              xs={12}
            >

              <TextField
                select
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >

                <MenuItem value="ADMIN">
                  ADMIN
                </MenuItem>

                <MenuItem value="PROCUREMENT">
                  PROCUREMENT
                </MenuItem>

                <MenuItem value="FINANCE">
                  FINANCE
                </MenuItem>

              </TextField>

            </Grid>

            <Grid
              item
              xs={12}
            >

              <TextField
                select
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <MenuItem value="active">
                  Active
                </MenuItem>

                <MenuItem value="inactive">
                  Inactive
                </MenuItem>

              </TextField>

            </Grid>

            <Grid
              item
              xs={12}
            >

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {
                  loading
                    ? "Saving..."
                    : id
                    ? "Update User"
                    : "Create User"
                }
              </Button>

            </Grid>

          </Grid>

        </form>

      </Paper>

    </Box>

  );

};

export default UserForm;