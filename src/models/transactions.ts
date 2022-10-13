import { v4 as createUuid } from "uuid";

export class Transactions {
  private _id: string;

  constructor(
    private _title: string,
    private _value: number,
    private _type: string
  ) {
    this._id = createUuid();
  }

  public get title() {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get value() {
    return this._value;
  }

  public set value(cpf: number) {
    this._value = cpf;
  }

  public get type() {
    return this._type;
  }

  public set type(type: any) {
    this._type = type;
  }

  public get id() {
    return this._id;
  }

  public get transactions(): string[] {
    return this.transactions ?? [];
  }

  // Adapter
  public getTransactions() {
    return {
      id: this._id,
      title: this._title,
      value: this._value,
      type: this._type,
      transactions: this.transactions,
    };
  }
}
