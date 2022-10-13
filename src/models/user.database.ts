import { Transactions } from "./transactions";

export interface UserDatabase {
  _name: string;
  _cpf: number;
  _email: string;
  _age: number;
  _transactions: Transactions[];
  _id: string;
}
