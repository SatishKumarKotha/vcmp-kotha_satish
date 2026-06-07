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
  useEffect,
  useState
} from "react";

import {
  useParams,
  useNavigate
} from "react-router-dom";

import {
  getVendorsService
} from "../../services/vendor.service";

import {
  createContractService,
  updateContractService,
  getContractByIdService
} from "../../services/contract.service";

const initialState = {
  vendor_id: "",
  title: "",
  value: "",
  currency: "INR",
  start_date: "",
  end_date: "",
  document_url: ""
};

const ContractForm = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [formData,
    setFormData] =
    useState(initialState);

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

    loadVendors();

    if (id) {
      loadContract();
    }

  }, [id]);

  const loadVendors =
    async () => {

      try {

        const response =
          await getVendorsService();

        const activeVendors =
          response.data.filter(
            vendor =>
              vendor.status ===
              "active"
          );

        setVendors(
          activeVendors
        );

      } catch (error) {

        console.log(error);

      }

    };

  const loadContract =
    async () => {

      try {

        const response =
          await getContractByIdService(
            id
          );

        const contract =
          response.contract ||
          response;

        setFormData({
          vendor_id:
            contract.vendor_id || "",

          title:
            contract.title || "",

          value:
            contract.value || "",

          currency:
            contract.currency || "INR",

          start_date:
            contract.start_date
              ?.split("T")[0] || "",

          end_date:
            contract.end_date
              ?.split("T")[0] || "",

          document_url:
            contract.document_url || ""
        });

      } catch (error) {

        console.log(error);

      }

    };

  const handleChange =
    (e) => {

      const {
        name,
        value
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]: value
        })
      );

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        if (id) {

          await updateContractService(
            id,
            formData
          );

        } else {

          await createContractService(
            formData
          );

        }

        navigate(
          "/contracts"
        );

      } catch (error) {

        setError(
          error.response?.data?.message ||
          "Failed to save contract"
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
          width: 800
        }}
      >

        <Typography
          variant="h5"
          mb={3}
        >
          {
            id
              ? "Edit Contract"
              : "Create Contract"
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
          onSubmit={
            handleSubmit
          }
        >

          <Grid
            container
            spacing={2}
          >

            <Grid
              item
              xs={12}
            >

              <TextField
                select
                fullWidth
                label="Vendor"
                name="vendor_id"
                value={
                  formData.vendor_id
                }
                onChange={
                  handleChange
                }
              >

                {
                  vendors.map(
                    (
                      vendor
                    ) => (

                      <MenuItem
                        key={
                          vendor.id
                        }
                        value={
                          vendor.id
                        }
                      >
                        {
                          vendor.company_name
                        }
                      </MenuItem>

                    )
                  )
                }

              </TextField>

            </Grid>

            <Grid
              item
              xs={12}
            >

              <TextField
                fullWidth
                label="Contract Title"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                type="number"
                label="Contract Value"
                name="value"
                value={
                  formData.value
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                select
                fullWidth
                label="Currency"
                name="currency"
                value={
                  formData.currency
                }
                onChange={
                  handleChange
                }
              >

                <MenuItem value="INR">
                  INR
                </MenuItem>

                <MenuItem value="USD">
                  USD
                </MenuItem>

                <MenuItem value="EUR">
                  EUR
                </MenuItem>

              </TextField>

            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                type="date"
                label="Start Date"
                name="start_date"
                value={
                  formData.start_date
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true
                }}
              />

            </Grid>

            <Grid
              item
              xs={12}
              md={6}
            >

              <TextField
                fullWidth
                type="date"
                label="End Date"
                name="end_date"
                value={
                  formData.end_date
                }
                onChange={
                  handleChange
                }
                InputLabelProps={{
                  shrink: true
                }}
              />

            </Grid>

            <Grid
              item
              xs={12}
            >

              <TextField
                fullWidth
                label="Document URL"
                name="document_url"
                value={
                  formData.document_url
                }
                onChange={
                  handleChange
                }
              />

            </Grid>

            <Grid
              item
              xs={12}
            >

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={
                  loading
                }
              >
                {
                  loading
                    ? "Saving..."
                    : id
                    ? "Update Contract"
                    : "Create Contract"
                }
              </Button>

            </Grid>

          </Grid>

        </form>

      </Paper>

    </Box>

  );

};

export default ContractForm;