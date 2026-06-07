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
    useNavigate
} from "react-router-dom";

import {
    createInvoiceService
} from "../../services/invoice.service";

import {
    getPurchaseOrdersService
} from "../../services/purchase-order.service";

import {
    getVendorsService
} from "../../services/vendor.service";

const initialState = {
    invoice_number: "",
    po_id: "",
    vendor_id: "",
    amount: "",
    tax_amount: "",
    total_amount: 0,
    invoice_date: "",
    due_date: ""
};

const InvoiceForm = () => {

    const navigate =
        useNavigate();

    const [formData,
        setFormData] =
        useState(initialState);

    const [purchaseOrders,
        setPurchaseOrders] =
        useState([]);

    const [vendors,
        setVendors] =
        useState([]);

    const [loading,
        setLoading] =
        useState(false);

    const [error,
        setError] =
        useState("");

    useEffect(() => {

        loadPurchaseOrders();
        loadVendors();

    }, []);

    useEffect(() => {

  const amount =
    Number(formData.amount || 0);

  const tax =
    Number(formData.tax_amount || 0);

  const total =
    amount + tax;

  if (
    total !== formData.total_amount
  ) {

    setFormData(prev => ({
      ...prev,
      total_amount: total
    }));

  }

}, [
  formData.amount,
  formData.tax_amount
]);

    const handleChange = (e) => {

  const {
    name,
    value
  } = e.target;

  if (name === "po_id") {

    const selectedPO =
      purchaseOrders.find(
        po =>
          po.id === Number(value)
      );

    setFormData(prev => ({
      ...prev,
      po_id: value,
      vendor_id:
        selectedPO?.vendor_id || ""
    }));

    return;
  }

  setFormData(prev => ({
    ...prev,
    [name]: value
  }));

};

    const loadPurchaseOrders =
        async () => {

            try {

                const response =
                    await getPurchaseOrdersService();

                const validPOs =
                    response.data.filter(
                        po =>
                            po.status !==
                            "cancelled"
                    );

                setPurchaseOrders(
                    validPOs
                );

            } catch (error) {

                console.log(error);

            }

        };

    const loadVendors =
        async () => {

            try {

                const response =
                    await getVendorsService();

                setVendors(
                    response.data
                );

            } catch (error) {

                console.log(error);

            }

        };

    const handleSubmit =
        async (e) => {

            e.preventDefault();

            const invoiceRegex =
                /^[A-Za-z0-9-]+$/;

            if (
                !invoiceRegex.test(
                    formData.invoice_number
                )
            ) {

                setError(
                    "Invalid Invoice Number"
                );

                return;
            }

            if (
                new Date(
                    formData.due_date
                ) <=
                new Date(
                    formData.invoice_date
                )
            ) {

                setError(
                    "Due Date must be after Invoice Date"
                );

                return;
            }

            try {

                setLoading(true);

                await createInvoiceService(
                    formData
                );

                navigate(
                    "/invoices"
                );

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to create invoice"
                );

            } finally {

                setLoading(false);

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
                    Create Invoice
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
                                fullWidth
                                label="Invoice Number"
                                name="invoice_number"
                                value={formData.invoice_number}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                select
                                fullWidth
                                label="Purchase Order"
                                name="po_id"
                                value={formData.po_id}
                                onChange={handleChange}
                            >

                                {
                                    purchaseOrders.map(
                                        (po) => (

                                            <MenuItem
                                                key={po.id}
                                                value={po.id}
                                            >
                                                {po.po_number}
                                            </MenuItem>

                                        )
                                    )
                                }

                            </TextField>

                        </Grid>

                        <Grid item xs={12} md={6}>

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

                        <Grid item xs={12} md={4}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Amount"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={4}>

                            <TextField
                                fullWidth
                                type="number"
                                label="Tax Amount"
                                name="tax_amount"
                                value={formData.tax_amount}
                                onChange={handleChange}
                            />

                        </Grid>

                        <Grid item xs={12} md={4}>

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
                                label="Invoice Date"
                                name="invoice_date"
                                value={formData.invoice_date}
                                onChange={handleChange}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField
                                fullWidth
                                type="date"
                                label="Due Date"
                                name="due_date"
                                value={formData.due_date}
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
                                        : "Create Invoice"
                                }
                            </Button>

                        </Grid>

                    </Grid>

                </form>

            </Paper>

        </Box>

    );

};

export default InvoiceForm;