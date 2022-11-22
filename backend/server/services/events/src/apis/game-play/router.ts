import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import {
  handleAppCreateGamePlay,
  handleAppEarnItem,
  handleAppGetGamePlay,
  handleAppGetGamePlayLatest,
  handleAppUpdateGamePlay,
  handleAppUpdateHeroStamina,
  handleAppUpdateHeroStaminaReset,
} from "./controller";
import {
  FormCreateGamePlay,
  FormEarnItem,
  FormUpdateGamePlay,
  FormUpdateHeroConsumStamina,
  FormUpdateHeroConsumStaminaReset,
} from "./schema";

const router: Router = Router();

// App
router.post("/app/game-play", validate(FormCreateGamePlay), auth, handleAppCreateGamePlay);
router.get("/app/game-play/latest", auth, handleAppGetGamePlayLatest);
router.get("/app/game-play/:id", auth, handleAppGetGamePlay);
router.post("/app/game-play/update", validate(FormUpdateGamePlay), auth, handleAppUpdateGamePlay);
router.post("/app/heros/consume-stamina", validate(FormUpdateHeroConsumStamina), auth, handleAppUpdateHeroStamina);
router.post(
  "/app/heros/consume-stamina/reset",
  validate(FormUpdateHeroConsumStaminaReset),
  auth,
  handleAppUpdateHeroStaminaReset,
);

// Earn spl-token if lucky on ending the game
router.post("/app/game-play/earn-item", validate(FormEarnItem), auth, handleAppEarnItem);

export { router };
