import {
  Box,
  Grid,
  Paper,
  Typography
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  getSummaryService,
  getSpendingService,
  getAlertsService
} from "../../services/dashboard.service";

const Reports = () => {

  const [summary,
    setSummary] =
    useState({
      totalVendors: 0,
      activeContracts: 0,
      openPurchaseOrders: 0,
      overdueInvoices: 0
    });

  const [spending,
    setSpending] =
    useState([]);

  const [alerts,
    setAlerts] =
    useState([]);

  useEffect(() => {

    loadReports();

  }, []);

  const loadReports =
    async () => {

      try {

        const [
          summaryRes,
          spendingRes,
          alertsRes
        ] = await Promise.all([
          getSummaryService(),
          getSpendingService(),
          getAlertsService()
        ]);

        setSummary(
          summaryRes.data
        );

        setSpending(
          spendingRes.data || []
        );

        setAlerts(
          alertsRes.data || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <DashboardLayout>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Reports
      </Typography>

      <Grid
        container
        spacing={3}
      >

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Total Vendors
            </Typography>

            <Typography variant="h4">
              {
                summary.totalVendors
              }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Active Contracts
            </Typography>

            <Typography variant="h4">
              {
                summary.activeContracts
              }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Open Purchase Orders
            </Typography>

            <Typography variant="h4">
              {
                summary.openPurchaseOrders
              }
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Overdue Invoices
            </Typography>

            <Typography variant="h4">
              {
                summary.overdueInvoices
              }
            </Typography>
          </Paper>
        </Grid>

      </Grid>

      <Paper
        sx={{
          p: 3,
          mt: 4
        }}
      >

        <Typography
          variant="h6"
          mb={2}
        >
          Monthly Spending
        </Typography>

        {
          spending.length === 0 ? (

            <Typography>
              No Spending Data
            </Typography>

          ) : (

            spending.map(
              (item, index) => (

                <Box
                  key={index}
                  mb={1}
                >

                  <Typography>
                    {item.month}
                    {" - ₹"}
                    {item.totalSpend}
                  </Typography>

                </Box>

              )
            )

          )
        }

      </Paper>

      <Paper
        sx={{
          p: 3,
          mt: 4
        }}
      >

        <Typography
          variant="h6"
          mb={2}
        >
          Alerts
        </Typography>

        {
          alerts.length === 0 ? (

            <Typography>
              No Alerts Found
            </Typography>

          ) : (

            alerts.map(
              (alert, index) => (

                <Box
                  key={index}
                  mb={1}
                >

                  <Typography>
                    {
                      JSON.stringify(
                        alert
                      )
                    }
                  </Typography>

                </Box>

              )
            )

          )
        }

      </Paper>

    </DashboardLayout>

  );

};

export default Reports;