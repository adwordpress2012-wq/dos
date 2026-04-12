import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import healthRouter from "./health";
import agenciesRouter from "./agencies";
import listingsRouter from "./listings";
import leadsRouter from "./leads";
import transcriptsRouter from "./transcripts";
import staffRouter from "./staff";
import billingRouter from "./billing";
import aiRouter from "./ai";
import voiceRouter from "./voice";
import dashboardRouter from "./dashboard";
import systemRouter from "./system";
import adminRouter from "./admin";
import mobileRouter from "./mobile";

const DEMO_ORG_ID = "org_demo_001";

const router: IRouter = Router();

router.use((req: Request, _res: Response, next: NextFunction) => {
  if (!req.headers["x-clerk-org-id"]) {
    req.headers["x-clerk-org-id"] = DEMO_ORG_ID;
  }
  next();
});

router.use(healthRouter);
router.use(agenciesRouter);
router.use(listingsRouter);
router.use(leadsRouter);
router.use(transcriptsRouter);
router.use(staffRouter);
router.use(billingRouter);
router.use(aiRouter);
router.use(voiceRouter);
router.use(dashboardRouter);
router.use(systemRouter);
router.use(adminRouter);
router.use(mobileRouter);

export default router;
