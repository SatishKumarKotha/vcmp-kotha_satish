import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
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
  getVendorByIdService
} from "../../services/vendor.service";

const VendorView = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [vendorData,
    setVendorData] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadVendor();

  }, []);

  const loadVendor =
    async () => {

      try {

        const response =
          await getVendorByIdService(id);

        setVendorData(
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
          Loading...
        </Typography>
      </DashboardLayout>
    );

  }

  const vendor =
    vendorData?.vendor;

  const contracts =
    vendorData?.contracts || [];

  const purchaseOrders =
    vendorData?.purchaseOrders || [];

  return (

    <DashboardLayout>

      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Vendor Details
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigate("/vendors")
          }
        >
          Back
        </Button>

      </Box>

      {/* Vendor Info */}

      <Paper sx={{ p: 3, mb: 4 }}>

        <Typography
          variant="h6"
          mb={3}
        >
          Vendor Information
        </Typography>

        <Grid
          container
          spacing={2}
        >

          <Grid item xs={6}>
            <Typography>
              <strong>Vendor Code:</strong>
              {" "}
              {vendor?.vendor_code}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Company Name:</strong>
              {" "}
              {vendor?.company_name}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Contact Person:</strong>
              {" "}
              {vendor?.contact_person}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Email:</strong>
              {" "}
              {vendor?.email}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Phone:</strong>
              {" "}
              {vendor?.phone}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>GSTIN:</strong>
              {" "}
              {vendor?.gstin}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography>
              <strong>Address:</strong>
              {" "}
              {vendor?.address}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography>
              <strong>Category:</strong>
              {" "}
              {vendor?.category}
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Chip
              label={vendor?.status}
              color={
                vendor?.status === "active"
                  ? "success"
                  : vendor?.status === "pending"
                  ? "warning"
                  : "error"
              }
            />
          </Grid>

        </Grid>

      </Paper>

      {/* Contracts */}

      <Paper sx={{ p: 3, mb: 4 }}>

        <Typography
          variant="h6"
          mb={2}
        >
          Contracts
        </Typography>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Contract Number
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
                Status
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {
              contracts.map(
                (contract) => (

                  <TableRow
                    key={contract.id}
                  >

                    <TableCell>
                      {contract.contract_number}
                    </TableCell>

                    <TableCell>
                      {contract.title}
                    </TableCell>

                    <TableCell>
                      {contract.value}
                    </TableCell>

                    <TableCell>
                      {contract.currency}
                    </TableCell>

                    <TableCell>
                      {contract.status}
                    </TableCell>

                  </TableRow>

                )
              )
            }

          </TableBody>

        </Table>

      </Paper>

      {/* Purchase Orders */}

      <Paper sx={{ p: 3 }}>

        <Typography
          variant="h6"
          mb={2}
        >
          Purchase Orders
        </Typography>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                PO Number
              </TableCell>

              <TableCell>
                Title
              </TableCell>

              <TableCell>
                Quantity
              </TableCell>

              <TableCell>
                Total Amount
              </TableCell>

              <TableCell>
                Status
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {
              purchaseOrders.map(
                (po) => (

                  <TableRow
                    key={po.id}
                  >

                    <TableCell>
                      {po.po_number}
                    </TableCell>

                    <TableCell>
                      {po.title}
                    </TableCell>

                    <TableCell>
                      {po.quantity}
                    </TableCell>

                    <TableCell>
                      {po.total_amount}
                    </TableCell>

                    <TableCell>
                      {po.status}
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

export default VendorView;