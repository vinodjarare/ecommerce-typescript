import { Router } from "express";
import userRoute from "@routes/user.route";
import productRoute from "@routes/product.route";
const router = Router();

router.use("/v1", userRoute);
router.use("/v1",productRoute)

export default router;
