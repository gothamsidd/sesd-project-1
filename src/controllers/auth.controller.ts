import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";

const service = new AuthService();

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const user = await service.register(name, email, password);

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const token = await service.login(email, password);

      res.json({ token });
    } catch (e) {
      next(e);
    }
  }
}
