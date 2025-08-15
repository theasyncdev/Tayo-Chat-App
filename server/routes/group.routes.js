import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth.js'
import { createGroupHandler } from '../controllers/group.controller.js';

const groupRouter = Router();


groupRouter.post('/create/:id',createGroupHandler);



export default groupRouter;