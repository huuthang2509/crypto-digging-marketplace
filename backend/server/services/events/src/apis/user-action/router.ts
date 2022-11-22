import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { generateSignature, verifySignature } from "./controller";
import { GenerateSignature, VerifyActionSignature } from "./schema";

const router: Router = Router();

router.post("/user/action/generate-signature", auth, validate(GenerateSignature), generateSignature);

router.post("/user/action/verify-signature", auth, validate(VerifyActionSignature), verifySignature);
export { router };
