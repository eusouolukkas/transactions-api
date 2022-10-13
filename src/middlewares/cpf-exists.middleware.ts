import { Request, Response, NextFunction } from "express";
import { UserController } from "../controllers/user.controller";

export const cpfExistsValidatorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cpf } = req.body;

  const user = new UserController().getByCpf(cpf);

  if (user) {
    return res.status(400).send({
      ok: false,
      message: "user already exists",
    });
  }
  next();
};
