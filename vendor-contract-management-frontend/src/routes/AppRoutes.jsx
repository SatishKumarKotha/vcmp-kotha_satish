import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "../pages/Login/Login";

import Dashboard from "../pages/Dashboard/Dashboard";

import ProtectedRoute from "../components/ProtectedRoute";

import VendorList from "../pages/vendors/VendorList";
import VendorForm from "../pages/vendors/VendorForm";
import VendorView from "../pages/vendors/VendorView";

import ContractList from "../pages/contracts/ContractList";
import ContractForm from "../pages/contracts/ContractForm";
import ContractView from "../pages/contracts/ContractView";

import PurchaseOrderList from "../pages/purchase-orders/PurchaseOrderList";
import PurchaseOrderForm from "../pages/purchase-orders/PurchaseOrderForm";
import PurchaseOrderView from "../pages/purchase-orders/PurchaseOrderView";

import InvoiceList from "../pages/invoices/InvoiceList";
import InvoiceForm from "../pages/invoices/InvoiceForm";
import InvoiceView from "../pages/invoices/InvoiceView";


import UserForm from "../pages/users/UserForm";
import UserList from "../pages/users/UserList";
import UserView from "../pages/users/UserView";

import AuditLogList from "../pages/audit-logs/AuditLogList";

import Profile from "../pages/profile/Profile";

import Reports from "../pages/reports/Reports";

import NotificationList from "../pages/notifications/NotificationList";

const AppRoutes = () => {

  return (
    <BrowserRouter>

      {/*  Login Routes */}
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        {/* Dashboard Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes */}

        <Route
          path="/vendors"
          element={
            <ProtectedRoute>
              <VendorList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors/create"
          element={
            <ProtectedRoute>
              <VendorForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors/edit/:id"
          element={
            <ProtectedRoute>
              <VendorForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendors/view/:id"
          element={
            <ProtectedRoute>
              <VendorView />
            </ProtectedRoute>
          }
        />

        {/* Contract Routes */}
        <Route
          path="/contracts"
          element={
            <ProtectedRoute>
              <ContractList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contracts/create"
          element={
            <ProtectedRoute>
              <ContractForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contracts/edit/:id"
          element={
            <ProtectedRoute>
              <ContractForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contracts/view/:id"
          element={
            <ProtectedRoute>
              <ContractView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase-orders"
          element={
            <ProtectedRoute>
              <PurchaseOrderList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-orders/create"
          element={
            <ProtectedRoute>
              <PurchaseOrderForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-orders/edit/:id"
          element={
            <ProtectedRoute>
              <PurchaseOrderForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/purchase-orders/view/:id"
          element={
            <ProtectedRoute>
              <PurchaseOrderView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoiceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/create"
          element={
            <ProtectedRoute>
              <InvoiceForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/invoices/view/:id"
          element={
            <ProtectedRoute>
              <InvoiceView />
            </ProtectedRoute>
          }
        />

        {/* User routes */}

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/create"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/edit/:id"
          element={
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/view/:id"
          element={
            <ProtectedRoute>
              <UserView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogList />
            </ProtectedRoute>
          }
        />

        {/* Proifle  */}

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationList />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );

};

export default AppRoutes;