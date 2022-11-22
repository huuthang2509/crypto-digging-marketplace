import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { getUserHistory } from "./controller";
import { FormGetUserHistory } from "./schema";

const router: Router = Router();

// Histories
router.get("/user/histories", validate(FormGetUserHistory), auth, getUserHistory);

export { router };
