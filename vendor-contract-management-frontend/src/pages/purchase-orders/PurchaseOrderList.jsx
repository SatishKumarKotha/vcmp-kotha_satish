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
  getPurchaseOrdersService,
  updatePurchaseOrderStatusService,
  deletePurchaseOrderService
} from "../../services/purchase-order.service";

const PurchaseOrderList = () => {

  const navigate =
    useNavigate();

  const [purchaseOrders,
    setPurchaseOrders] =
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

  const [selectedPO,
    setSelectedPO] =
    useState(null);

  const [selectedStatus,
    setSelectedStatus] =
    useState("");

  const [statusDialog,
    setStatusDialog] =
    useState(false);

  useEffect(() => {

    loadPurchaseOrders();

  }, []);

  const loadPurchaseOrders =
    async () => {

      try {

        const response =
          await getPurchaseOrdersService();

        setPurchaseOrders(
          response.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  const handleCancel =
    async (id) => {

      const confirmed =
        window.confirm(
          "Cancel Purchase Order?"
        );

      if (!confirmed) {
        return;
      }

      try {

        await deletePurchaseOrderService(
          id
        );

        toast.success(
          "Purchase Order Cancelled"
        );

        loadPurchaseOrders();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      }

    };

  const openStatusDialog =
    (po) => {

      setSelectedPO(po);

      setSelectedStatus(
        po.status
      );

      setStatusDialog(true);

    };

  const handleStatusUpdate =
    async () => {

      try {

        await updatePurchaseOrderStatusService(
          selectedPO.id,
          selectedStatus
        );

        toast.success(
          "Status Updated"
        );

        setStatusDialog(false);

        loadPurchaseOrders();

      } catch (error) {

        toast.error(
          error.response?.data?.message ||
          "Failed"
        );

      }

    };

  const filteredPOs =
    purchaseOrders.filter(
      (po) => {

        const searchMatch =

          po.po_number
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          po.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )

          ||

          po.company_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const statusMatch =

          !status ||

          po.status === status;

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
          Purchase Orders
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              "/purchase-orders/create"
            )
          }
        >
          Create PO
        </Button>

      </Box>

      <Box
        display="flex"
        gap={2}
        mb={3}
      >

        <TextField
          label="Search PO"
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

          <MenuItem value="sent">
            Sent
          </MenuItem>

          <MenuItem value="fulfilled">
            Fulfilled
          </MenuItem>

          <MenuItem value="cancelled">
            Cancelled
          </MenuItem>

        </TextField>

      </Box>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                PO Number
              </TableCell>

              <TableCell>
                Vendor
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
                Delivery Date
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
              filteredPOs.map(
                (po) => (

                  <TableRow
                    key={po.id}
                  >

                    <TableCell>
                      {po.po_number}
                    </TableCell>

                    <TableCell>
                      {po.company_name}
                    </TableCell>

                    <TableCell>
                      {po.title}
                    </TableCell>

                    <TableCell>
                      {po.quantity}
                    </TableCell>

                    <TableCell>
                      ₹{po.total_amount}
                    </TableCell>

                    <TableCell>
                      {
                        po.delivery_date
                          ?.split("T")[0]
                      }
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={po.status}
                        color={
                          po.status ===
                          "fulfilled"
                            ? "success"
                            : po.status ===
                              "draft"
                            ? "warning"
                            : po.status ===
                              "sent"
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
                            `/purchase-orders/view/${po.id}`
                          )
                        }
                      >
                        View
                      </Button>

                      {
                        po.status ===
                        "draft" && (
                          <Button
                            size="small"
                            onClick={() =>
                              navigate(
                                `/purchase-orders/edit/${po.id}`
                              )
                            }
                          >
                            Edit
                          </Button>
                        )
                      }

                      {
                        po.status !==
                        "cancelled" && (
                          <Button
                            size="small"
                            color="warning"
                            onClick={() =>
                              openStatusDialog(
                                po
                              )
                            }
                          >
                            Status
                          </Button>
                        )
                      }

                      {
                        po.status ===
                        "draft" && (
                          <Button
                            size="small"
                            color="error"
                            onClick={() =>
                              handleCancel(
                                po.id
                              )
                            }
                          >
                            Cancel
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

      <Dialog
        open={statusDialog}
        onClose={() =>
          setStatusDialog(false)
        }
      >

        <DialogTitle>
          Update PO Status
        </DialogTitle>

        <DialogContent>

          <TextField
            select
            fullWidth
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(
                e.target.value
              )
            }
            sx={{ mt: 2 }}
          >

            <MenuItem value="draft">
              Draft
            </MenuItem>

            <MenuItem value="sent">
              Sent
            </MenuItem>

            <MenuItem value="fulfilled">
              Fulfilled
            </MenuItem>

            <MenuItem value="cancelled">
              Cancelled
            </MenuItem>

          </TextField>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setStatusDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              handleStatusUpdate
            }
          >
            Update
          </Button>

        </DialogActions>

      </Dialog>

    </DashboardLayout>

  );

};

export default PurchaseOrderList;