import express from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  addContribution,
  deleteGoal,
} from '../controllers/goalController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getGoals);
router.post('/', createGoal);
router.patch('/:id', updateGoal);
router.post('/:id/contributions', addContribution);
router.delete('/:id', deleteGoal);

export default router;
