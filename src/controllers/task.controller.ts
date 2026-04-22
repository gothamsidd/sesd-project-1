import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { TaskService } from "../services/task.service";

const service = new TaskService();

export class TaskController {
  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(
        await service.create({
          ...req.body,
          userId: req.userId!
        })
      );
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

  update = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      res.json(await service.update(id, req.userId!, req.body));
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
