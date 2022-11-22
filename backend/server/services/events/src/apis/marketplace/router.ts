import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import {
  handleGetMarketplace,
  handleGetOneMarketplace,
  handlePurchaseItemFromMarketplace,
  handleRemoveItemFromMarketplace,
  handleSendItemToMarketplace,
} from "./controller";
import { FormGetMarketPlace, FormGetOneMarketPlace, FormPurchaseItem, FormRemoveItem, FormSaleItem } from "./schema";

const router: Router = Router();

router.get("/marketplace", validate(FormGetMarketPlace), handleGetMarketplace);
router.get("/marketplace/:itemId", validate(FormGetOneMarketPlace), handleGetOneMarketplace);

router.post("/marketplace", validate(FormSaleItem), auth, handleSendItemToMarketplace);
router.post("/marketplace/remove", validate(FormRemoveItem), auth, handleRemoveItemFromMarketplace);
router.post("/marketplace/purchase", validate(FormPurchaseItem), auth, handlePurchaseItemFromMarketplace);

export { router };
