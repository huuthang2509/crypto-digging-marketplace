import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Heros } from "./hero";
import { Users } from "./user";

@Table({ tableName: "users_heros" })
export class UsersHeros extends Model<UsersHeros> {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column
  public ownerId: string;
  @BelongsTo(() => Users, "ownerId")
  public owner: Users;

  @PrimaryKey
  @ForeignKey(() => Heros)
  @Column
  public heroId: string;
  @BelongsTo(() => Heros, "heroId")
  public hero: Heros;

  @Column
  public earnFrom: string;

  @Column
  public isOnMarket: boolean;
}
