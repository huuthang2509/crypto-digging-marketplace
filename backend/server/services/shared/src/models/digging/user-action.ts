import { Column, Model, Table } from "sequelize-typescript";
import { StatusCode } from "../base";

export enum ActionTypes {
  TransferOwner = "transfer_owner",
  Payment = "payment", // when using currency to transfer for another user,
  Purchase = "purchase",
  SendToMarket = "send_to_market",
  Remove = "remove",
  OpenBox = "open_box",
}
@Table({ tableName: "user_actions" })
export class UserActions extends Model<UserActions> {
  @Column
  public nonce: string;

  @Column
  public signature: string;

  @Column
  public walletAddress: string;

  @Column
  public createdAt: Date;

  @Column
  public updatedAt: Date;

  @Column
  public expiredAt!: Date;

  @Column
  public action: ActionTypes;

  @Column
  public status: StatusCode;
}
