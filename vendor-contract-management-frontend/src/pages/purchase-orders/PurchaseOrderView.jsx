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
  getPurchaseOrderByIdService
} from "../../services/purchase-order.service";

const PurchaseOrderView = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [purchaseOrder,
    setPurchaseOrder] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadPurchaseOrder();

  }, []);

  const loadPurchaseOrder =
    async () => {

      try {

        const response =
          await getPurchaseOrderByIdService(
            id
          );

        setPurchaseOrder(
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
          Loading Purchase Order...
        </Typography>

      </DashboardLayout>

    );

  }

  if (!purchaseOrder) {

    return (

      <DashboardLayout>

        <Typography color="error">
          Purchase Order not found
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
          Purchase Order Details
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              "/purchase-orders"
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

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Purchase Order Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                PO Number:
              </strong>{" "}
              {
                purchaseOrder.po_number
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Title:
              </strong>{" "}
              {
                purchaseOrder.title
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Quantity:
              </strong>{" "}
              {
                purchaseOrder.quantity
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Unit Price:
              </strong>{" "}
              ₹{
                purchaseOrder.unit_price
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Tax %:
              </strong>{" "}
              {
                purchaseOrder.tax_percent
              }%
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Total Amount:
              </strong>{" "}
              ₹{
                purchaseOrder.total_amount
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Delivery Date:
              </strong>{" "}
              {
                purchaseOrder.delivery_date
                  ?.split("T")[0]
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>

            <Typography mb={1}>
              <strong>
                Status:
              </strong>
            </Typography>

            <Chip
              label={
                purchaseOrder.status
              }
              color={
                purchaseOrder.status ===
                "fulfilled"
                  ? "success"
                  : purchaseOrder.status ===
                    "draft"
                  ? "warning"
                  : purchaseOrder.status ===
                    "sent"
                  ? "info"
                  : "error"
              }
            />

          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Vendor Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Vendor Name:
              </strong>{" "}
              {
                purchaseOrder.company_name
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Vendor Code:
              </strong>{" "}
              {
                purchaseOrder.vendor_code
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Contract Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Contract Number:
              </strong>{" "}
              {
                purchaseOrder.contract_number ||
                "-"
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Contract Title:
              </strong>{" "}
              {
                purchaseOrder.contract_title ||
                "-"
              }
            </Typography>
          </Grid>

        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid
          container
          spacing={3}
        >

          <Grid item xs={12}>
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Audit Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Raised By:
              </strong>{" "}
              {
                purchaseOrder.raised_by_name
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Created At:
              </strong>{" "}
              {
                purchaseOrder.created_at
                  ?.split("T")[0]
              }
            </Typography>
          </Grid>

        </Grid>

      </Paper>

    </DashboardLayout>

  );

};

export default PurchaseOrderView;