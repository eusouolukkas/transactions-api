import { NextFunction, Request, Response } from "express";
import { userList } from "../data/user.list";

export const userValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = userList.some((user) => user.id == id);

  if (!user) {
    return res.status(400).send({
      ok: false,
      message: "User is not found!",
    });
  }

  next();
};
