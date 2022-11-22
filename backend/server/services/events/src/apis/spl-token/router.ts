import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { handleCreateSplToken, handleTransferAuthority, handleTransferCDG, withdrawSolMoney } from "./controller";
import { FormTransferCGD } from "./schema";

const router: Router = Router();

router.post("/create-spl-token", handleCreateSplToken);
router.post("/transfer-authority", handleTransferAuthority);

router.post("/transfer/transfer-cdg-token", auth, validate(FormTransferCGD), handleTransferCDG);

router.post("/withdraw", auth, validate(FormTransferCGD), withdrawSolMoney);

export { router };
