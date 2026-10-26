import express from 'express';
import {
  getTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCsv,
} from '../controllers/transactionController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/export', exportTransactionsCsv);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransactionById);
router.patch('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
