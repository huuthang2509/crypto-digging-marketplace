import { Router } from "express";
import { validate } from "shared";
import { auth } from "../../middlewares";
import { handlePostAppSignIn, handlePostAuthSignIn, handlePostSignUp } from "./controller";
import { FormAppSignIn, FormAuthSignIn, FormAuthSignUp } from "./schema";

const router: Router = Router();

// Web
router.post("/auth/sign-in", validate(FormAuthSignIn), handlePostAuthSignIn);
router.post("/sign-up", validate(FormAuthSignUp), auth, handlePostSignUp);

// App
router.post("/app/sign-in", validate(FormAppSignIn), handlePostAppSignIn);

export { router };
