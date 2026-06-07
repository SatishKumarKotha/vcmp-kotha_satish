import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Divider
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
  getInvoiceByIdService
} from "../../services/invoice.service";

const InvoiceView = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [invoice,
    setInvoice] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadInvoice();

  }, []);

  const loadInvoice =
    async () => {

      try {

        const response =
          await getInvoiceByIdService(
            id
          );

        setInvoice(
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
          Loading Invoice...
        </Typography>

      </DashboardLayout>

    );

  }

  if (!invoice) {

    return (

      <DashboardLayout>

        <Typography color="error">
          Invoice not found
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
          Invoice Details
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigate("/invoices")
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

        {/* Invoice Information */}

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Invoice Information
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Invoice Number:
              </strong>{" "}
              {
                invoice.invoice_number
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Status:
              </strong>
            </Typography>

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
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <strong>
                Amount:
              </strong>{" "}
              ₹{
                invoice.amount
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <strong>
                Tax Amount:
              </strong>{" "}
              ₹{
                invoice.tax_amount
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography>
              <strong>
                Total Amount:
              </strong>{" "}
              ₹{
                invoice.total_amount
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Invoice Date:
              </strong>{" "}
              {
                invoice.invoice_date
                  ?.split("T")[0]
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Due Date:
              </strong>{" "}
              {
                invoice.due_date
                  ?.split("T")[0]
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 4 }}
        />

        {/* Purchase Order */}

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Purchase Order Information
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                PO Number:
              </strong>{" "}
              {
                invoice.po_number
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                PO Title:
              </strong>{" "}
              {
                invoice.po_title
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 4 }}
        />

        {/* Vendor Information */}

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Vendor Information
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Vendor Name:
              </strong>{" "}
              {
                invoice.company_name
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Vendor Code:
              </strong>{" "}
              {
                invoice.vendor_code
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 4 }}
        />

        {/* Payment Information */}

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Payment Information
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Payment Reference:
              </strong>{" "}
              {
                invoice.payment_ref ||
                "-"
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Paid Date:
              </strong>{" "}
              {
                invoice.paid_date
                  ? invoice.paid_date
                      .split("T")[0]
                  : "-"
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 4 }}
        />

        {/* Reviewer Information */}

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Reviewer Information
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Reviewer:
              </strong>{" "}
              {
                invoice.reviewer_name ||
                "-"
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider
          sx={{ my: 4 }}
        />

        {/* Audit Information */}

        <Typography
          variant="h6"
          fontWeight="bold"
          mb={2}
        >
          Audit Information
        </Typography>

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Created At:
              </strong>{" "}
              {
                invoice.created_at
                  ?.split("T")[0]
              }
            </Typography>
          </Grid>

        </Grid>

      </Paper>

    </DashboardLayout>

  );

};

export default InvoiceView;