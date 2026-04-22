import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { SubjectService } from "../services/subject.service";

const service = new SubjectService();

export class SubjectController {
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const subject = await service.create(req.body.name, req.userId!);
      res.status(201).json(subject);
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

  delete = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      await service.delete(id, req.userId!);
      res.json({ message: "Deleted" });
    } catch (e) {
      next(e);
    }
  };
}
