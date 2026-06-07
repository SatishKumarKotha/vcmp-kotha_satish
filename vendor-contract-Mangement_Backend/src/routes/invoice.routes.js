import express from "express";  

import authMiddleware from "../middlewares/auth.middleware.js";
import roleMiddleWare from "../middlewares/role.middleware.js";
import {getInvoices} from "../controllers/invoice.controller.js";
import {createInvoice} from "../controllers/invoice.controller.js";
import {getInvoiceById} from "../controllers/invoice.controller.js";
import {approveInvoice} from "../controllers/invoice.controller.js";
import {markInvoicePaid} from "../controllers/invoice.controller.js";
import {disputeInvoice} from "../controllers/invoice.controller.js";


const router = express.Router(); // express router 
console.log('Invoce Routes')
router.get( "/",authMiddleware,getInvoices);
router.post(  "/", authMiddleware,roleMiddleWare("ADMIN", "FINANCE" ),createInvoice);
router.get("/:id",authMiddleware,getInvoiceById);
router.patch("/:id/approve",authMiddleware,roleMiddleWare("ADMIN","FINANCE"),approveInvoice);
router.patch( "/:id/mark-paid",authMiddleware,roleMiddleWare("ADMIN", "FINANCE" ),markInvoicePaid);
router.patch("/:id/dispute",authMiddleware,roleMiddleWare("ADMIN","FINANCE"),disputeInvoice);

export default router;