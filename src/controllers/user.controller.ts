import { Request, Response } from "express";
import { userList } from "../data/user.list";
import { UserRepository } from "../database/users.repository";
import { User } from "../models/user";

export class UserController {
  public list(req: Request, res: Response) {
    try {
      const list = new UserRepository().list();

      return res.status(200).send(list);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public updateUser(nome: string, age: number) {
    const user = userList.find((item) => item.name === nome);

    if (!user) {
      return undefined;
    }

    user.name = nome;
    user.age = age;

    return userList;
  }

  public createUser(req: Request, res: Response) {
    try {
      const { name, cpf, email, age } = req.body;
      if (!name) {
        return res.status(400).send({
          ok: false,
          message: "Name not provided",
        });
      }

      if (!cpf) {
        return res.status(400).send({
          ok: false,
          message: "CPF not provided",
        });
      }

      if (!email) {
        return res.status(400).send({
          ok: false,
          message: "Email not provided",
        });
      }

      if (!age) {
        return res.status(400).send({
          ok: false,
          message: "Age not provided",
        });
      }

      // CPF deve ser único por usuário.
      const repository = new UserRepository();
      let list = repository.list();

      if (list.some((user) => user._cpf === cpf)) {
        return res.status(400).send({
          ok: false,
          message: "CPF already exists",
        });
      }

      const user = new User(name, cpf, email, age);

      repository.create(user);

      list = repository.list();

      return res.status(201).send({
        ok: true,
        message: "User successfully created",
        data: list,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public getUser(req: Request, res: Response) {
    try {
      return res.send({
        ok: true,
        message: "Listing all users",
        data: userList,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = userList.find((item) => item.id === id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      return res.status(200).send({
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        age: user.age,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let userIndex = userList.findIndex((item) => item.id === id);

      if (userIndex < 0) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      userList.splice(userIndex, 1);

      return res.status(200).send({
        ok: true,
        message: "User successfully deleted",
        data: userList,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public getByCpf(cpf: number) {
    const repository = new UserRepository();

    return repository.list().find((item) => item._cpf === cpf);
  }
}
