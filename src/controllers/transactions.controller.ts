import { Request, Response } from "express";
import { transactionsList } from "../data/transaction.list";
import { userList } from "../data/user.list";
import { Transactions } from "../models/transactions";

export class TransactionsController {
  public list(userId?: string) {
    let lista = transactionsList;

    if (userId) {
      lista = transactionsList.filter((item) => item.id === userId);
    }

    let listaRetorno = lista.map((user) => {
      return user.getTransactions();
    });

    return listaRetorno;
  }

  public updateTransactions(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, value } = req.body;
      const transactions = transactionsList.find(
        (transaction) => transaction.id === id
      );

      if (transactions) {
        transactions.title = title;
        transactions.value = value;
      }

      return res.send({
        id: id,
        title: title,
        value: value,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public createTransactions(req: Request, res: Response) {
    try {
      const { title, value, type } = req.body;
      const { userId } = req.params;

      if (!title) {
        return res.status(400).send({
          ok: false,
          message: "Title not provided",
        });
      }

      if (!value) {
        return res.status(400).send({
          ok: false,
          message: "Value not provided",
        });
      }

      if (!type) {
        return res.status(400).send({
          ok: false,
          message: "Type not provided",
        });
      }

      if (type !== "income" && type !== "outcome") {
        return res.status(400).send({
          ok: false,
          message: "Type value is invalid",
        });
      }

      const transaction = new Transactions(title, value, type);

      const user = userList.find((user) => user.id === userId);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User is not found",
        });
      }

      user.transactions.push(transaction);

      return res.status(201).send({
        ok: true,
        message: "Transaction successfully created",
        data: {
          title: transaction.title,
          value: transaction.value,
          type: transaction.type,
          id: transaction.id,
        },
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public getTransactions(req: Request, res: Response) {
    try {
      const { userId, id } = req.params;

      const user = userList.find((user) => user.id === userId);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User is not found",
        });
      }

      let incomes = user.transactions
        .filter((transaction) => transaction.type == "income")
        .reduce((prev, transaction) => {
          return prev + transaction.value;
        }, 0);

      let outcomes = user.transactions
        .filter((transaction) => transaction.type == "outcome")
        .reduce((prev, transaction) => {
          return prev + transaction.value;
        }, 0);

      let resultTypes = user.transactions
        .filter((transaction) => transaction.type == "outcome")
        .reduce((prev, transaction) => {
          return prev - transaction.value;
        }, 0);

      console.log(`Total de incomes é: ${incomes}`);
      console.log(`Total de outcomes é: ${outcomes}`);
      console.log(`Total de resultTypes é: ${resultTypes}`);

      const transaction = user.transactions.find(
        (transaction) => transaction.id == id
      );

      if (!transaction) {
        return res.status(404).send({
          ok: false,
          message: "Transaction not found",
        });
      }

      return res.status(200).send({
        transactions: user.transactions.map((item) => {
          return {
            id: item.id,
            title: item.title,
            value: item.value,
            type: item.type,
          };
        }),
        balance: {
          income: incomes,
          outcome: outcomes,
          balance: resultTypes,
        },
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        error: error.toString(),
      });
    }
  }
}
