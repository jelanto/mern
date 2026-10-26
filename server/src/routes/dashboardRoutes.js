import express from 'express';
import {
  getDashboardSummary,
  getCashFlowVelocity,
  getExpenseBreakdown,
  getRecentTransactions,
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/summary', getDashboardSummary);
router.get('/cash-flow', getCashFlowVelocity);
router.get('/expense-breakdown', getExpenseBreakdown);
router.get('/recent-transactions', getRecentTransactions);

export default router;
