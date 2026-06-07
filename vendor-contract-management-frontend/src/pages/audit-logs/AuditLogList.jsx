import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  MenuItem
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getAuditLogsService
} from "../../services/auditlog.service";

const AuditLogList = () => {

  const [logs,
    setLogs] =
    useState([]);

  const [entityType,
    setEntityType] =
    useState("");

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadAuditLogs();

  }, [entityType]);

  const loadAuditLogs =
    async () => {

      try {

        const response =
          await getAuditLogsService(
            entityType
          );

        setLogs(
          response.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  return (

    <DashboardLayout>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Audit Logs
      </Typography>

      <Box mb={3}>

        <TextField
          select
          label="Entity Type"
          value={entityType}
          onChange={(e) =>
            setEntityType(
              e.target.value
            )
          }
          sx={{ width: 250 }}
        >

          <MenuItem value="">
            All
          </MenuItem>

          <MenuItem value="VENDOR">
            Vendor
          </MenuItem>

          <MenuItem value="CONTRACT">
            Contract
          </MenuItem>

          <MenuItem value="PURCHASE_ORDER">
            Purchase Order
          </MenuItem>

          <MenuItem value="INVOICE">
            Invoice
          </MenuItem>

        </TextField>

      </Box>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                User
              </TableCell>

              <TableCell>
                Action
              </TableCell>

              <TableCell>
                Entity Type
              </TableCell>

              <TableCell>
                Entity ID
              </TableCell>

              <TableCell>
                Date
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {
              logs.map(
                (log) => (

                  <TableRow
                    key={log.id}
                  >

                    <TableCell>
                      {log.name}
                    </TableCell>

                    <TableCell>
                      {log.action}
                    </TableCell>

                    <TableCell>
                      {log.entity_type}
                    </TableCell>

                    <TableCell>
                      {log.entity_id}
                    </TableCell>

                    <TableCell>
                      {
                        log.created_at
                          ?.split("T")[0]
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

export default AuditLogList;