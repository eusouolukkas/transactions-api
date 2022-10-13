import { Request, Response, Router } from "express";
import { TransactionsController } from "../controllers/transactions.controller";
import { UserController } from "../controllers/user.controller";
import { cpfExistsValidatorMiddleware } from "../middlewares/cpf-exists.middleware";
import { cpfValidatorMiddleware } from "../middlewares/cpf.validator";
import { logGetMiddleware } from "../middlewares/get.middlewares";
import { logMiddleware } from "../middlewares/log.middlewares";
import { userValidator } from "../middlewares/user.exists";

const userRoutes = Router();

userRoutes.use(logMiddleware);

// POST - Parâmetros => body
userRoutes.post(
  "/",
  //[cpfValidatorMiddleware, cpfExistsValidatorMiddleware],
  (req: Request, res: Response) => new UserController().createUser(req, res)
);

//GET
userRoutes.get("/:id", [logGetMiddleware], (req: Request, res: Response) =>
  new UserController().getUserById(req, res)
);

userRoutes.get("/", [logGetMiddleware], (req: Request, res: Response) =>
  new UserController().getUser(req, res)
);

// DELETE
userRoutes.delete("/:id", (req: Request, res: Response) =>
  new UserController().deleteUser(req, res)
);

//---------------TransactionsRoutes--------------

userRoutes.get(
  "/:userId/transactions/:id",
  //[userValidator],
  (req: Request, res: Response) =>
    new TransactionsController().getTransactions(req, res)
);

userRoutes.post(
  "/:userId/transactions",
  //[userValidator],
  (req: Request, res: Response) => {
    new TransactionsController().createTransactions(req, res);
  }
);

userRoutes.put(
  "/:userId/transactions/:id",
  //[userValidator],
  (req: Request, res: Response) =>
    new TransactionsController().updateTransactions(req, res)
);

export { userRoutes };
