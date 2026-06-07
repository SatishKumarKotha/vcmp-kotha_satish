import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Link
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
  getContractByIdService
} from "../../services/contract.service";

const ContractView = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [contract,
    setContract] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {

    loadContract();

  }, []);

  const loadContract =
    async () => {

      try {

        const response =
          await getContractByIdService(
            id
          );

        setContract(
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
          Loading Contract...
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
          Contract Details
        </Typography>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              "/contracts"
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

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Contract Number:
              </strong>
              {" "}
              {
                contract.contract_number
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Title:
              </strong>
              {" "}
              {
                contract.title
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Vendor:
              </strong>
              {" "}
              {
                contract.company_name
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Vendor Code:
              </strong>
              {" "}
              {
                contract.vendor_code
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Value:
              </strong>
              {" "}
              ₹{
                contract.value
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Currency:
              </strong>
              {" "}
              {
                contract.currency
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Start Date:
              </strong>
              {" "}
              {
                contract.start_date
                  ?.split("T")[0]
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                End Date:
              </strong>
              {" "}
              {
                contract.end_date
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
                contract.status
              }
              color={
                contract.status ===
                "active"
                  ? "success"
                  : contract.status ===
                    "draft"
                  ? "warning"
                  : contract.status ===
                    "expired"
                  ? "info"
                  : "error"
              }
            />

          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Created By:
              </strong>
              {" "}
              {
                contract.created_by_name
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Approved By:
              </strong>
              {" "}
              {
                contract.approved_by_name ||
                "-"
              }
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography>
              <strong>
                Approved At:
              </strong>
              {" "}
              {
                contract.approved_at
                  ? contract.approved_at
                      .split("T")[0]
                  : "-"
              }
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography mb={1}>
              <strong>
                Document:
              </strong>
            </Typography>

            <Link
              href={
                contract.document_url
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              View Contract Document
            </Link>

          </Grid>

        </Grid>

      </Paper>

    </DashboardLayout>

  );

};

export default ContractView;