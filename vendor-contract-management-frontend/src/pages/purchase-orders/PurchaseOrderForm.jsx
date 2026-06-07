import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem
} from "@mui/material";

import {
  useState,
  useEffect
} from "react";

import {
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getVendorsService
} from "../../services/vendor.service";

import {
  getContractsService
} from "../../services/contract.service";

import {
  createPurchaseOrderService,
  updatePurchaseOrderService,
  getPurchaseOrderByIdService
} from "../../services/purchase-order.service";

const initialState = {
  vendor_id: "",
  contract_id: "",
  title: "",
  quantity: "",
  unit_price: "",
  tax_percent: 18,
  total_amount: 0,
  delivery_date: ""
};
const PurchaseOrderForm = ()=>{

    const navigate = useNavigate();

const { id } = useParams();

    const [formData, setFormData] =
  useState(initialState);

const [vendors, setVendors] =
  useState([]);

const [contracts, setContracts] =
  useState([]);

const [loading, setLoading] =
  useState(false);

const [error, setError] =
  useState("");

//   Caluculate Total Amount 

useEffect(() => {

  const quantity =
    Number(formData.quantity || 0);

  const unitPrice =
    Number(formData.unit_price || 0);

  const tax =
    Number(formData.tax_percent || 0);

  const total =
    quantity *
    unitPrice *
    (1 + tax / 100);

  setFormData(prev => ({
    ...prev,
    total_amount:
      total.toFixed(2)
  }));

}, [
  formData.quantity,
  formData.unit_price,
  formData.tax_percent
]);

useEffect(() => {

  loadVendors();
  loadContracts();

  if (id) {
    loadPurchaseOrder();
  }

}, [id]);

const loadPurchaseOrder = async () => {

  try {

    const response =
      await getPurchaseOrderByIdService(id);

    setFormData({
      vendor_id:
        response.vendor_id || "",

      contract_id:
        response.contract_id || "",

      title:
        response.title || "",

      quantity:
        response.quantity || "",

      unit_price:
        response.unit_price || "",

      tax_percent:
        response.tax_percent || 18,

      total_amount:
        response.total_amount || 0,

      delivery_date:
        response.delivery_date
          ?.split("T")[0] || ""
    });

  } catch (error) {

    console.log(error);

  }

};


const handleChange = (e) => {

  const {
    name,
    value
  } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

};

// load Active vendors

const loadVendors = async () => {

  const response =
    await getVendorsService();

  const activeVendors =
    response.data.filter(
      vendor =>
        vendor.status === "active"
    );

  setVendors(
    activeVendors
  );

};

// load Contracts
const loadContracts = async () => {

  const response =
    await getContractsService();

  const activeContracts =
    response.data.filter(
      contract =>
        contract.status === "active"
    );

  setContracts(
    activeContracts
  );

};

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    const payload = {
      vendor_id:
        Number(formData.vendor_id),

      contract_id:
        formData.contract_id
          ? Number(formData.contract_id)
          : null,

      title:
        formData.title,

      quantity:
        Number(formData.quantity),

      unit_price:
        Number(formData.unit_price),

      tax_percent:
        Number(formData.tax_percent),

      delivery_date:
        formData.delivery_date
    };

    if (id) {

      await updatePurchaseOrderService(
        id,
        payload
      );

    } else {

      await createPurchaseOrderService(
        payload
      );

    }

    navigate(
      "/purchase-orders"
    );

  } catch (error) {

    setError(
      error.response?.data?.message ||
      "Failed to save Purchase Order"
    );

  }

};
return (

  <Box
    display="flex"
    justifyContent="center"
    mt={4}
  >

    <Paper
      sx={{
        p: 4,
        width: 850
      }}
    >

      <Typography
        variant="h5"
        mb={3}
      >
        {
          id
            ? "Edit Purchase Order"
            : "Create Purchase Order"
        }
      </Typography>

      {
        error && (
          <Typography
            color="error"
            mb={2}
          >
            {error}
          </Typography>
        )
      }

      <form
        onSubmit={handleSubmit}
      >

        <Grid
          container
          spacing={2}
        >

          <Grid item xs={12}>

            <TextField
              select
              fullWidth
              label="Vendor"
              name="vendor_id"
              value={formData.vendor_id}
              onChange={handleChange}
            >

              {
                vendors.map(
                  (vendor) => (

                    <MenuItem
                      key={vendor.id}
                      value={vendor.id}
                    >
                      {vendor.company_name}
                    </MenuItem>

                  )
                )
              }

            </TextField>

          </Grid>

          <Grid item xs={12}>

            <TextField
              select
              fullWidth
              label="Contract"
              name="contract_id"
              value={formData.contract_id}
              onChange={handleChange}
            >

              <MenuItem value="">
                No Contract
              </MenuItem>

              {
                contracts.map(
                  (contract) => (

                    <MenuItem
                      key={contract.id}
                      value={contract.id}
                    >
                      {
                        contract.contract_number
                      }
                    </MenuItem>

                  )
                )
              }

            </TextField>

          </Grid>

          <Grid item xs={12}>

            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              type="number"
              label="Unit Price"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              fullWidth
              type="number"
              label="Tax %"
              name="tax_percent"
              value={formData.tax_percent}
              onChange={handleChange}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              label="Total Amount"
              value={formData.total_amount}
              InputProps={{
                readOnly: true
              }}
            />

          </Grid>

          <Grid item xs={12} md={6}>

            <TextField
              fullWidth
              type="date"
              label="Delivery Date"
              name="delivery_date"
              value={formData.delivery_date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />

          </Grid>

          <Grid item xs={12}>

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {
                loading
                  ? "Saving..."
                  : id
                  ? "Update Purchase Order"
                  : "Create Purchase Order"
              }
            </Button>

          </Grid>

        </Grid>

      </form>

    </Paper>

  </Box>

);
}
export default PurchaseOrderForm