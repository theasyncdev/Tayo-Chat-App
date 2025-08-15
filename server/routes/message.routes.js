import { Router } from 'express';
import { getMessageHandler, sendMessageHandler } from '../controllers/message.controller.js';
import { multerUploader } from '../services/multer.service.js';

const messageRouter = Router();

messageRouter.post('/send/:id', multerUploader, sendMessageHandler);

messageRouter.get('/get/:id', getMessageHandler);

export default messageRouter;
