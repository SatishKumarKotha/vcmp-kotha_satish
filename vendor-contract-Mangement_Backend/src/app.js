import express from "express"; 
import dotenv from "dotenv";  // ----connecting env file to access db constants
import cors from "cors";  // ---this for allowing cors
import authRoutes from "./routes/auth.routes.js"; //  routing area
import userRoutes from  "./routes/user.routes.js"
import vendorRoutes from  "./routes/vendor.routes.js"
import contractRoutes from  "./routes/contract.routes.js"
import dashboardRoutes from "./routes/dashboard.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
dotenv.config();// load the env config
const app = express(); // load express  

app.use(cors({
    origin:  "http://localhost:5173"
  })
);    // allowing cors for front local url as of now
app.use(express.json());  //  json conversion request


app.use("/api/auth", authRoutes);   
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/contracts', contractRoutes);
app.use("/api/dashboard",dashboardRoutes);
app.use( "/api/purchase-orders",purchaseRoutes);
app.use( "/api/invoices",invoiceRoutes);
app.use( "/api/audit-logs",auditRoutes);
app.use("/api/notifications",notificationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});