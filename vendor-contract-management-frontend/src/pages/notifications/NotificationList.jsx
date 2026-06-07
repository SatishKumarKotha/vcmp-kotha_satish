import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getNotificationsService,
  markNotificationReadService
} from "../../services/notification.service";

const NotificationList = () => {

  const [notifications,
    setNotifications] =
    useState([]);

  useEffect(() => {

    loadNotifications();

  }, []);

  const loadNotifications =
    async () => {

      const response =
        await getNotificationsService();

      setNotifications(
        response.data || []
      );

    };

  const handleRead =
    async (id) => {

      await markNotificationReadService(
        id
      );

      loadNotifications();

    };

  return (

    <DashboardLayout>

      <Typography
        variant="h4"
        mb={3}
      >
        Notifications
      </Typography>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Title
              </TableCell>

              <TableCell>
                Message
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Date
              </TableCell>

              <TableCell>
                Action
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {
              notifications.map(
                (
                  notification
                ) => (

                  <TableRow
                    key={
                      notification.id
                    }
                  >

                    <TableCell>
                      {
                        notification.title
                      }
                    </TableCell>

                    <TableCell>
                      {
                        notification.message
                      }
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={
                          notification.is_read
                            ? "Read"
                            : "Unread"
                        }
                        color={
                          notification.is_read
                            ? "success"
                            : "warning"
                        }
                      />

                    </TableCell>

                    <TableCell>
                      {
                        notification.created_at
                          ?.split("T")[0]
                      }
                    </TableCell>

                    <TableCell>

                      {
                        !notification.is_read && (

                          <Button
                            size="small"
                            onClick={() =>
                              handleRead(
                                notification.id
                              )
                            }
                          >
                            Mark Read
                          </Button>

                        )
                      }

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

export default NotificationList;