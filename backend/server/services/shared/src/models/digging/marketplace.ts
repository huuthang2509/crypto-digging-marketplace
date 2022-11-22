import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { StatusCode } from "../base";
import { Users } from "./user";

export enum SaleStatus {
  OnMarket = "on_market",
  OffMarket = "off_wallet",
  Delivered = "delivered",
  Rejected = "rejected",
}

export enum MarketRefType {
  Hero = "hero",
  Box = "box",
}

@Table({ tableName: "marketplace" })
export class Marketplace extends Model<Marketplace> {
  @ForeignKey(() => Users)
  @Column
  public ownerId: string;
  @BelongsTo(() => Users, "ownerId")
  public owner: Users;

  @Column
  public CDGPrice: number;

  @Column
  public createdBy: string;

  @Column
  public updatedBy: string;

  @Column
  public status: StatusCode;

  @Column
  public saleStatus: SaleStatus;

  @Column
  public refId: string;

  @Column
  public refType: MarketRefType;

  @Column(DataType.JSONB)
  public itemCapture: object;
}
