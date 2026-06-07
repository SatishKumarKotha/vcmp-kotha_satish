import {
  useEffect,
  useState
} from "react";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem
} from "@mui/material";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  getVendorByIdService,
  createVendorService,
  updateVendorService
} from "../../services/vendor.service";

const initialState = {
  vendor_code: "",
  company_name: "",
  contact_person: "",
  email: "",
  phone: "",
  gstin: "",
  address: "",
  category: "",
  status: "active"
};
const VendorForm = ({ onSuccess }) => {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- handle input ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ---------------- load vendor ----------------
  const fetchVendorById = async (id) => {

    try {

      const response =
        await getVendorByIdService(id);

      const vendor =
        response.vendor;

      setFormData({
        vendor_code: vendor.vendor_code || "",
        company_name: vendor.company_name || "",
        contact_person: vendor.contact_person || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        gstin: vendor.gstin || "",
        address: vendor.address || "",
        category: vendor.category || "",
        status: vendor.status || "active"
      });

    } catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {
    if (id) {
      fetchVendorById(id);
    }
  }, [id]);

  // ---------------- submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (id) {
        await updateVendorService(id, formData);
      } else {
        await createVendorService(formData);
      }

      navigate("/vendors");

    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to save vendor"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" justifyContent="center" mt={4}>
      <Paper sx={{ p: 4, width: 650 }}>

        <Typography variant="h5" mb={3}>
          {id ? "Edit Vendor" : "Create Vendor"}
        </Typography>

        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Vendor Code"
                name="vendor_code"
                value={formData.vendor_code}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Company Name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Person"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GSTIN"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </Grid>

            {id && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="blacklisted">Blacklisted</MenuItem>
                </TextField>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : id ? "Update Vendor" : "Create Vendor"}
              </Button>
            </Grid>

          </Grid>
        </form>

      </Paper>
    </Box>
  );
};

export default VendorForm;