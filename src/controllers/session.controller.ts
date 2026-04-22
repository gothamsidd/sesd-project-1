import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { SessionService } from "../services/session.service";

const service = new SessionService();

export class SessionController {
  start = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await service.start(req.userId!, req.body.subjectId));
    } catch (e) {
      next(e);
    }
  };

  getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json(await service.getAll(req.userId!));
    } catch (e) {
      next(e);
    }
  };

  end = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const session = await service.end(id, req.userId!);
      res.json(session);
    } catch (e) {
      next(e);
    }
  };
}
