import { Router } from "express";
import { auth } from "../../middlewares";
import { getUserBalance } from "./controller";

const router: Router = Router();

// Infos
router.get("/user/info/balance", auth, getUserBalance);

export { router };
