import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { MarketRefType } from "./marketplace";
import { Users } from "./user";

export enum UserLogAction {
  Purchase = "purchase",
  SaleUp = "sale_up",
  SaleDown = "sale_down",
  Claim = "claim",
  OpenBox = "open_box",
}

@Table({ tableName: "user_logs" })
export class UsersLogs extends Model<UsersLogs> {
  @ForeignKey(() => Users)
  @Column
  public userId: string;
  @BelongsTo(() => Users, "userId")
  public user: Users;

  @Column
  public createdBy: string;

  @Column
  public logType: MarketRefType;

  @Column
  public action: UserLogAction;

  @Column(DataType.JSONB)
  public data: object;
}
