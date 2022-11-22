import { Column, HasMany, Model, Table } from "sequelize-typescript";
import { StatusCode } from "./../base";
import { Boxes } from "./box";
import { Heros } from "./hero";

@Table({ tableName: "users" })
export class Users extends Model<Users> {
  @Column
  public username: string;

  @Column
  public password: string;

  @Column
  public walletAddress: string;

  @Column
  public status: StatusCode;

  @Column
  public CDG: number;

  @HasMany(() => Boxes)
  public boxes: Boxes[];

  @HasMany(() => Heros)
  public heros: Heros[];
}
