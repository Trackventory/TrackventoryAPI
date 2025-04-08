const express = require("express");
const reportRouter = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const { activeUserMiddleware } = require('../middleware/activeUserMiddleware');

const {
  getStockReport,
  getSalesReport,
  getOutOfStockReport,
} = require("../controllers/reportController");

reportRouter.use(authMiddleware);
reportRouter.use(activeUserMiddleware);

// Only active Admin and Manager can get stock reports
reportRouter.get("/stock", roleMiddleware(["Admin", "Manager"]), getStockReport);

reportRouter.get("/sales", roleMiddleware(["Admin", "Manager"]), getSalesReport);

reportRouter.get("/out-of-stock", roleMiddleware(["Admin", "Manager"]), getOutOfStockReport);

module.exports = reportRouter;
