import express from 'express';
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getBudgets);
router.post('/', createBudget);
router.patch('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
