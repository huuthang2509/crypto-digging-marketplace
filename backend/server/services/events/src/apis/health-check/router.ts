import { Request, Response, Router } from "express";

const router: Router = Router();

router.get("/", (_: Request, res: Response) => {
  return res.status(200).json({ message: "Healthz" });
});

export { router };
