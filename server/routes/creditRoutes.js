import express from 'express'
import { getPlans } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const creditRouter = express.Router();

creditRouter.get('/plans',getPlans);

export default creditRouter;