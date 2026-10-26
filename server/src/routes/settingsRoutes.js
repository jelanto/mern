import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getSettings);
router.patch('/', updateSettings);

export default router;
