import {
  Grid,
  Typography,
  Paper,
  Box
} from "@mui/material";

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import KpiCard from "../../components/dashboard/KpiCard";
import SpendingChart from "../../components/dashboard/SpendingChart";
import {
  getSummaryService,
  getSpendingService,
  getAlertsService
} from "../../services/dashboard.service";

const Dashboard = () => {

const [summary, setSummary] =
  useState({
    totalVendors: 0,
    activeContracts: 0,
    openPurchaseOrders: 0,
    overdueInvoices: 0
  });

const [spending, setSpending] =
  useState([]);

const [alerts, setAlerts] =
  useState({
    expiringContracts: [],
    overdueInvoices: []
  });

  const [loading, setLoading] =
  useState(true);

  useEffect(() => {

    loadDashboard();

  }, []);

const loadDashboard = async () => {

  try {

    setLoading(true);

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
      summaryRes?.data|| {
        totalVendors: 0,
        activeContracts: 0,
        openPurchaseOrders: 0,
        overdueInvoices: 0
      }
    );

    setSpending(
      spendingRes?.data|| []
    );

    setAlerts(
      alertsRes?.data|| {
        expiringContracts: [],
        overdueInvoices: []
      }
    );

  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

    setSummary({
      totalVendors: 0,
      activeContracts: 0,
      openPurchaseOrders: 0,
      overdueInvoices: 0
    });

    setSpending([]);

    setAlerts({
      expiringContracts: [],
      overdueInvoices: []
    });

  } finally {

    setLoading(false);

  }

};

if (loading) {

  return (
    <DashboardLayout>
      <Typography>
        Loading Dashboard...
      </Typography>
    </DashboardLayout>
  );

}

  return (
    <DashboardLayout>

        {/* PAGE TITLE */}
    <Typography
      variant="h4"
      mb={3}
      fontWeight="bold"
    >
      Dashboard
    </Typography>

    {/* KPI CARDS */}
    <Grid container spacing={3}>

      <Grid item xs={12} md={3}>
        <KpiCard
          title="Total Vendors"
          value={summary?.totalVendors || 0}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <KpiCard
          title="Active Contracts"
          value={summary?.activeContracts ??  0}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <KpiCard
          title="Open Purchase Orders"
          value={summary?.openPurchaseOrders ?? 0}
        />
      </Grid>

      <Grid item xs={12} md={3}>
        <KpiCard
          title="Overdue Invoices"
          value={summary?.overdueInvoices ?? 0}
        />
      </Grid>

    </Grid>

    {/* MONTHLY SPENDING CHART */}
    <Paper
      sx={{
        mt: 4,
        p: 3
      }}
    >
      <Typography
        variant="h6"
        mb={2}
      >
        Monthly Spending
      </Typography>

      <SpendingChart
          data={spending || []}
      />
    </Paper>

    {/* ALERTS */}
    <Paper
      sx={{
        mt: 4,
        p: 3
      }}
    >
      <Typography
        variant="h6"
        mb={3}
      >
        Alerts
      </Typography>

      {/* Expiring Contracts */}

      <Typography
        fontWeight="bold"
        color="warning.main"
      >
        Expiring Contracts
      </Typography>

    {
  alerts?.expiringContracts?.length > 0
    ? alerts.expiringContracts.map(
        (contract) => (
          <Box
            key={contract.id}
          >
            {contract.contract_number}
          </Box>
        )
      )
    : (
      <Typography>
        No Expiring Contracts
      </Typography>
    )
}
      {/* Overdue Invoices */}

      <Typography
        mt={4}
        fontWeight="bold"
        color="error.main"
      >
        Overdue Invoices
      </Typography>

      {alerts.overdueInvoices?.map(
        (invoice) => (
          <Box
            key={invoice.id}
            sx={{
              p: 2,
              mb: 1,
              border: "1px solid #E5E7EB",
              borderRadius: 2
            }}
          >
            {invoice.invoice_number}
            {" - ₹"}
            {invoice.total_amount}
          </Box>
        )
      )}

    </Paper>

    </DashboardLayout>
  );

};

export default Dashboard;