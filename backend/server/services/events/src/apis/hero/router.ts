import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { handleGetAppHeros, handleGetHeros, handlePostAppHeroRest } from "./controller";
import { FormGetInventoryHeros, FormPostRestHero } from "./schema";

const router: Router = Router();

// Web
router.get("/heros/inventory", validate(FormGetInventoryHeros), auth, handleGetHeros);

// App
router.get("/app/heros", auth, handleGetAppHeros);
router.post("/app/heros/rest", validate(FormPostRestHero), auth, handlePostAppHeroRest);

export { router };
