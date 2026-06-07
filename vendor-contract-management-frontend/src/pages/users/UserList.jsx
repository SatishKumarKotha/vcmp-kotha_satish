import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getUsersService
} from "../../services/user.service";

const UserList = () => {

  const navigate =
    useNavigate();

  const [users,
    setUsers] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  useEffect(() => {

    loadUsers();

  }, []);

  const loadUsers =
    async () => {

      try {

        const response =
          await getUsersService();

        setUsers(
          response.result || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const filteredUsers =
    users.filter(
      (user) =>

        user.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        user.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        user.role
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

    );

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
          Users
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              "/users/create"
            )
          }
        >
          Create User
        </Button>

      </Box>

      <TextField
        fullWidth
        label="Search User"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        sx={{ mb: 3 }}
      />

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Name
              </TableCell>

              <TableCell>
                Email
              </TableCell>

              <TableCell>
                Role
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Created Date
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {
              filteredUsers.map(
                (user) => (

                  <TableRow
                    key={user.id}
                  >

                    <TableCell>
                      {user.name}
                    </TableCell>

                    <TableCell>
                      {user.email}
                    </TableCell>

                    <TableCell>
                      {user.role}
                    </TableCell>

                    <TableCell>

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

                    </TableCell>

                    <TableCell>

                      {
                        user.created_at
                          ?.split("T")[0]
                      }

                    </TableCell>

                    <TableCell>

                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            `/users/view/${user.id}`
                          )
                        }
                      >
                        View
                      </Button>

                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            `/users/edit/${user.id}`
                          )
                        }
                      >
                        Edit
                      </Button>

                    </TableCell>

                  </TableRow>

                )
              )
            }

          </TableBody>

        </Table>

      </Paper>

    </DashboardLayout>

  );

};

export default UserList;