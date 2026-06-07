import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  MenuItem
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  toast
} from "react-toastify";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getContractsService,
  approveContractService,
  terminateContractService
} from "../../services/contract.service";

const ContractList = () => {

  const navigate =
    useNavigate();

  const [contracts,
    setContracts] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
    useState("");

  const [status,
    setStatus] =
    useState("");

  useEffect(() => {

    loadContracts();

  }, []);

  const loadContracts =
    async () => {

      try {

        const response =
          await getContractsService();

        setContracts(
          response.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const handleApprove =
    async (id) => {

      try {

        await approveContractService(
          id
        );

        toast.success(
          "Contract Approved"
        );

        loadContracts();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Approval Failed"
        );

      }

    };

  const handleTerminate =
    async (id) => {

      const confirmed =
        window.confirm(
          "Terminate Contract?"
        );

      if (!confirmed) return;

      try {

        await terminateContractService(
          id
        );

        toast.success(
          "Contract Terminated"
        );

        loadContracts();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Termination Failed"
        );

      }

    };

  const filteredContracts =
    contracts.filter(
      (contract) => {

        const searchMatch =

          contract.contract_number
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          contract.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          contract.company_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const statusMatch =

          !status ||

          contract.status ===
          status;

        return (
          searchMatch &&
          statusMatch
        );

      }
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
          Contracts
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              "/contracts/create"
            )
          }
        >
          Add Contract
        </Button>

      </Box>

      <Box
        display="flex"
        gap={2}
        mb={3}
      >

        <TextField
          label="Search Contract"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          sx={{ flex: 1 }}
        />

        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          sx={{ width: 180 }}
        >

          <MenuItem value="">
            All
          </MenuItem>

          <MenuItem value="draft">
            Draft
          </MenuItem>

          <MenuItem value="active">
            Active
          </MenuItem>

          <MenuItem value="expired">
            Expired
          </MenuItem>

          <MenuItem value="terminated">
            Terminated
          </MenuItem>

        </TextField>

      </Box>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Contract No
              </TableCell>

              <TableCell>
                Vendor
              </TableCell>

              <TableCell>
                Title
              </TableCell>

              <TableCell>
                Value
              </TableCell>

              <TableCell>
                Currency
              </TableCell>

              <TableCell>
                Start Date
              </TableCell>

              <TableCell>
                End Date
              </TableCell>

              <TableCell>
                Status
              </TableCell>

              <TableCell>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {
              filteredContracts.map(
                (contract) => (

                  <TableRow
                    key={contract.id}
                  >

                    <TableCell>
                      {
                        contract.contract_number
                      }
                    </TableCell>

                    <TableCell>
                      {
                        contract.company_name
                      }
                    </TableCell>

                    <TableCell>
                      {
                        contract.title
                      }
                    </TableCell>

                    <TableCell>
                      ₹{
                        contract.value
                      }
                    </TableCell>

                    <TableCell>
                      {
                        contract.currency
                      }
                    </TableCell>

                    <TableCell>
                      {
                        contract.start_date
                          ?.split("T")[0]
                      }
                    </TableCell>

                    <TableCell>
                      {
                        contract.end_date
                          ?.split("T")[0]
                      }
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={
                          contract.status
                        }
                        color={
                          contract.status ===
                          "active"
                            ? "success"
                            : contract.status ===
                              "draft"
                            ? "warning"
                            : contract.status ===
                              "expired"
                            ? "info"
                            : "error"
                        }
                      />

                    </TableCell>

                    <TableCell>

                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            `/contracts/view/${contract.id}`
                          )
                        }
                      >
                        View
                      </Button>

                      {
                        contract.status ===
                        "draft" && (
                          <>
                            <Button
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/contracts/edit/${contract.id}`
                                )
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              size="small"
                              color="success"
                              onClick={() =>
                                handleApprove(
                                  contract.id
                                )
                              }
                            >
                              Approve
                            </Button>
                          </>
                        )
                      }

                      {
                        contract.status ===
                        "active" && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              handleTerminate(
                                contract.id
                              )
                            }
                          >
                            Terminate
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

export default ContractList;