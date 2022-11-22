import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { handleGetBalance, handleGetGameBalance, handleTransferGemToCDG } from "./controller";
import { FormWithdrawGem } from "./schema";

const router: Router = Router();

router.get("/get-balance", handleGetBalance);

router.get("/get-game-balance", auth, handleGetGameBalance);

router.post("/withdraw-gem", auth, validate(FormWithdrawGem), handleTransferGemToCDG);

export { router };
