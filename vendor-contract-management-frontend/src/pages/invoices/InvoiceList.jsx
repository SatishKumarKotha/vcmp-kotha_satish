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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  getInvoicesService,
  approveInvoiceService,
  markPaidInvoiceService,
  disputeInvoiceService
} from "../../services/invoice.service";

const InvoiceList = () => {

  const navigate =
    useNavigate();

  const [invoices,
    setInvoices] =
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

  const [paymentDialog,
    setPaymentDialog] =
    useState(false);

  const [disputeDialog,
    setDisputeDialog] =
    useState(false);

  const [selectedInvoice,
    setSelectedInvoice] =
    useState(null);

  const [paymentRef,
    setPaymentRef] =
    useState("");

  const [disputeReason,
    setDisputeReason] =
    useState("");

  useEffect(() => {

    loadInvoices();

  }, []);

  const loadInvoices =
    async () => {

      try {

        const response =
          await getInvoicesService();

        setInvoices(
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

        await approveInvoiceService(
          id
        );

        toast.success(
          "Invoice Approved"
        );

        loadInvoices();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      }

    };

  const handleMarkPaid =
    async () => {

      try {

        await markPaidInvoiceService(
          selectedInvoice.id,
          paymentRef
        );

        toast.success(
          "Invoice Marked Paid"
        );

        setPaymentDialog(false);

        setPaymentRef("");

        loadInvoices();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      }

    };

  const handleDispute =
    async () => {

      try {

        await disputeInvoiceService(
          selectedInvoice.id,
          disputeReason
        );

        toast.success(
          "Invoice Disputed"
        );

        setDisputeDialog(false);

        setDisputeReason("");

        loadInvoices();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      }

    };

  const filteredInvoices =
    invoices.filter(
      (invoice) => {

        const searchMatch =

          invoice.invoice_number
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          invoice.po_number
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          invoice.company_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const statusMatch =

          !status ||

          invoice.status ===
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
          Invoices
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              "/invoices/create"
            )
          }
        >
          Create Invoice
        </Button>

      </Box>

      <Box
        display="flex"
        gap={2}
        mb={3}
      >

        <TextField
          label="Search Invoice"
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
          sx={{ width: 200 }}
        >

          <MenuItem value="">
            All
          </MenuItem>

          <MenuItem value="pending">
            Pending
          </MenuItem>

          <MenuItem value="approved">
            Approved
          </MenuItem>

          <MenuItem value="paid">
            Paid
          </MenuItem>

          <MenuItem value="overdue">
            Overdue
          </MenuItem>

          <MenuItem value="disputed">
            Disputed
          </MenuItem>

        </TextField>

      </Box>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Invoice Number
              </TableCell>

              <TableCell>
                PO Number
              </TableCell>

              <TableCell>
                Vendor
              </TableCell>

              <TableCell>
                Amount
              </TableCell>

              <TableCell>
                Tax
              </TableCell>

              <TableCell>
                Total
              </TableCell>

              <TableCell>
                Due Date
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
              filteredInvoices.map(
                (invoice) => (

                  <TableRow
                    key={invoice.id}
                    sx={{
                      backgroundColor:
                        invoice.is_overdue
                          ? "#FEF2F2"
                          : "inherit"
                    }}
                  >

                    <TableCell>
                      {
                        invoice.invoice_number
                      }
                    </TableCell>

                    <TableCell>
                      {
                        invoice.po_number
                      }
                    </TableCell>

                    <TableCell>
                      {
                        invoice.company_name
                      }
                    </TableCell>

                    <TableCell>
                      ₹{invoice.amount}
                    </TableCell>

                    <TableCell>
                      ₹{invoice.tax_amount}
                    </TableCell>

                    <TableCell>
                      ₹{invoice.total_amount}
                    </TableCell>

                    <TableCell>
                      {
                        invoice.due_date
                          ?.split("T")[0]
                      }
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={
                          invoice.status
                        }
                        color={
                          invoice.status ===
                          "paid"
                            ? "success"
                            : invoice.status ===
                              "approved"
                            ? "info"
                            : invoice.status ===
                              "pending"
                            ? "warning"
                            : invoice.status ===
                              "overdue"
                            ? "error"
                            : "secondary"
                        }
                      />

                    </TableCell>

                    <TableCell>

                      <Button
                        size="small"
                        onClick={() =>
                          navigate(
                            `/invoices/view/${invoice.id}`
                          )
                        }
                      >
                        View
                      </Button>

                      {
                        invoice.status ===
                        "pending" && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              onClick={() =>
                                handleApprove(
                                  invoice.id
                                )
                              }
                            >
                              Approve
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              onClick={() => {

                                setSelectedInvoice(
                                  invoice
                                );

                                setDisputeDialog(
                                  true
                                );

                              }}
                            >
                              Dispute
                            </Button>
                          </>
                        )
                      }

                      {
                        invoice.status ===
                        "approved" && (
                          <>
                            <Button
                              size="small"
                              color="success"
                              onClick={() => {

                                setSelectedInvoice(
                                  invoice
                                );

                                setPaymentDialog(
                                  true
                                );

                              }}
                            >
                              Mark Paid
                            </Button>

                            <Button
                              size="small"
                              color="error"
                              onClick={() => {

                                setSelectedInvoice(
                                  invoice
                                );

                                setDisputeDialog(
                                  true
                                );

                              }}
                            >
                              Dispute
                            </Button>
                          </>
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

      <Dialog
        open={paymentDialog}
        onClose={() =>
          setPaymentDialog(false)
        }
      >

        <DialogTitle>
          Mark Invoice Paid
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            label="Payment Reference"
            value={paymentRef}
            onChange={(e) =>
              setPaymentRef(
                e.target.value
              )
            }
            sx={{ mt: 2 }}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setPaymentDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleMarkPaid
            }
          >
            Submit
          </Button>

        </DialogActions>

      </Dialog>

      <Dialog
        open={disputeDialog}
        onClose={() =>
          setDisputeDialog(false)
        }
      >

        <DialogTitle>
          Dispute Invoice
        </DialogTitle>

        <DialogContent>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason"
            value={disputeReason}
            onChange={(e) =>
              setDisputeReason(
                e.target.value
              )
            }
            sx={{ mt: 2 }}
          />

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDisputeDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={
              handleDispute
            }
          >
            Submit
          </Button>

        </DialogActions>

      </Dialog>

    </DashboardLayout>

  );

};

export default InvoiceList;