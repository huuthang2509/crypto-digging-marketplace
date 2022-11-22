import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { handleGetBoxes, handleGetInventoryBoxes, handlePostOpenBox, handlePostPurchaseBoxes } from "./controller";
import { FormGetInventoryBoxes, FormOpenBox, FormPurchaseBoxes } from "./schema";

const router: Router = Router();

// Get master boxes
router.get("/boxes", handleGetBoxes);

router.get("/boxes/inventory", validate(FormGetInventoryBoxes), auth, handleGetInventoryBoxes);
router.post("/boxes/purchase", validate(FormPurchaseBoxes), auth, handlePostPurchaseBoxes);
router.post("/boxes/open", validate(FormOpenBox), auth, handlePostOpenBox);

export { router };
