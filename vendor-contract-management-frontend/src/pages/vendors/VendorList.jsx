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
  DialogActions,
  Select
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";
import { toast } from "react-toastify";
import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getVendorsService,
   approveVendorService,
  updateVendorStatusService,
  deleteVendorService
} from "../../services/vendor.service";

const VendorList = () => {

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [category, setCategory] =
    useState("");

  const navigate =
    useNavigate();

  const [vendors, setVendors] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [statusDialog,
  setStatusDialog] =
  useState(false);

const [selectedVendor,
  setSelectedVendor] =
  useState(null);

const [selectedStatus,
  setSelectedStatus] =
  useState("");

  useEffect(() => {

    loadVendors();

  }, []);

  const loadVendors =
    async () => {

      try {

        const response =
          await getVendorsService();

        setVendors(
          response.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };
const filteredVendors =
  vendors.filter(
    (vendor) => {

      const searchMatch =

        vendor.company_name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

        ||

        vendor.vendor_code
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const statusMatch =

        !status ||

        vendor.status ===
        status;

      const categoryMatch =

        !category ||

        vendor.category
          ?.toLowerCase()
          .includes(
            category.toLowerCase()
          );

      return (
        searchMatch &&
        statusMatch &&
        categoryMatch
      );

    }
  );

  const handleApprove =
async (id) => {

  try {

    await approveVendorService(
      id
    );

    toast.success(
      "Vendor Approved"
    );

    loadVendors();

  } catch (error) {

    toast.error(
      error.response?.data?.message
    );

  }

};

const handleDelete =
async (id) => {

  const confirmed =
    window.confirm(
      "Delete this vendor?"
    );

  if (!confirmed) return;

  try {

    await deleteVendorService(
      id
    );

    toast.success(
      "Vendor Deleted"
    );

    loadVendors();

  } catch (error) {

    toast.error(
      error.response?.data?.message
    );

  }

};

const openStatusDialog =
(vendor) => {

  setSelectedVendor(
    vendor
  );

  setSelectedStatus(
    vendor.status
  );

  setStatusDialog(true);

};

const handleStatusUpdate =
async () => {

  try {

    await updateVendorStatusService(
      selectedVendor.id,
      selectedStatus
    );

    toast.success(
      "Status Updated"
    );

    setStatusDialog(false);

    loadVendors();

  } catch (error) {

    toast.error(
      error.response?.data?.message
    );

  }

};
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
          Vendors
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            navigate(
              "/vendors/create"
            )
          }
        >
          Add Vendor
        </Button>

      </Box>

 <Box
  display="flex"
  gap={2}
  mb={3}
>

  <TextField
    label="Search Vendor"
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

    <MenuItem value="pending">
      Pending
    </MenuItem>

    <MenuItem value="approved">
      Approved
    </MenuItem>

    <MenuItem value="active">
      Active
    </MenuItem>

    <MenuItem value="inactive">
      Inactive
    </MenuItem>

    <MenuItem value="blacklisted">
      Blacklisted
    </MenuItem>

  </TextField>

  <TextField
    label="Category"
    value={category}
    onChange={(e) =>
      setCategory(
        e.target.value
      )
    }
    sx={{ width: 220 }}
  />

</Box>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Vendor Code
              </TableCell>

              <TableCell>
                Company Name
              </TableCell>
              <TableCell>
                GSTIN
              </TableCell>

              <TableCell>
                Contact Person
              </TableCell>

              <TableCell>
                Email
              </TableCell>

              <TableCell>
                Phone
              </TableCell>

              <TableCell>
                Category
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
              filteredVendors.map(
                (vendor) => (

                  <TableRow
                    key={vendor.id}
                  >

                    <TableCell>
                      {
                        vendor.vendor_code
                      }
                    </TableCell>

                    <TableCell>
                      {
                        vendor.company_name
                      }
                    </TableCell>
                    <TableCell>
                      {vendor.gstin}
                    </TableCell>

                    <TableCell>
                      {
                        vendor.contact_person
                      }
                    </TableCell>

                    <TableCell>
                      {
                        vendor.email
                      }
                    </TableCell>

                    <TableCell>
                      {
                        vendor.phone
                      }
                    </TableCell>

                    <TableCell>
                      {
                        vendor.category
                      }
                    </TableCell>

                    <TableCell>

                      <Chip
                        label={vendor.status}
                        color={
                          vendor.status === "active"
                            ? "success"
                            : vendor.status === "pending"
                              ? "warning"
                              : vendor.status === "approved"
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
        `/vendors/view/${vendor.id}`
      )
    }
  >
    View
  </Button>

  <Button
    size="small"
    onClick={() =>
      navigate(
        `/vendors/edit/${vendor.id}`
      )
    }
  >
    Edit
  </Button>

  {
    vendor.status ===
    "pending" && (

      <Button
        size="small"
        color="success"
        onClick={() =>
          handleApprove(
            vendor.id
          )
        }
      >
        Approve
      </Button>

    )
  }

  <Button
    size="small"
    color="warning"
    onClick={() =>
      openStatusDialog(
        vendor
      )
    }
  >
    Status
  </Button>

  <Button
    size="small"
    color="error"
    onClick={() =>
      handleDelete(
        vendor.id
      )
    }
  >
    Delete
  </Button>

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
    Change Vendor Status
  </DialogTitle>

  <DialogContent>

    <Select
      fullWidth
      value={selectedStatus}
      onChange={(e) =>
        setSelectedStatus(
          e.target.value
        )
      }
    >

      <MenuItem value="approved">
        Approved
      </MenuItem>

      <MenuItem value="active">
        Active
      </MenuItem>

      <MenuItem value="inactive">
        Inactive
      </MenuItem>

      <MenuItem value="blacklisted">
        Blacklisted
      </MenuItem>

      <MenuItem value="rejected">
        Rejected
      </MenuItem>

    </Select>

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

export default VendorList;