import {Router} from "express";
import { getMessageHandler, sendMessageHandler } from "../controllers/message.controller.js";

const messageRouter = Router();


messageRouter.post('/send/:id', sendMessageHandler )

messageRouter.get('/get/:id', getMessageHandler);



export default messageRouter;