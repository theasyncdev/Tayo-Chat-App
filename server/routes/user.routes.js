import { Router } from "express";

const userRouter = Router();


userRouter.get('/', (req , res) => {
    res.json({user: req.user})
})



export default userRouter;