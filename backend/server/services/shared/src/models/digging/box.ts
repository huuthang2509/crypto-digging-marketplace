import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { EarnFrom } from "../base";
import { BoxesTypes } from "./box-type";
import { Heros } from "./hero";
import { Users } from "./user";

@Table({ tableName: "boxes" })
export class Boxes extends Model<Boxes> {
  @Column
  public tokenId: string;

  @Column
  public isOpened: boolean;

  @ForeignKey(() => Users)
  @Column
  public ownerId: string;
  @BelongsTo(() => Users, "ownerId")
  public owner: Users;

  @ForeignKey(() => BoxesTypes)
  @Column
  public boxInfoId: string;
  @BelongsTo(() => BoxesTypes, "boxInfoId")
  public boxInfo: BoxesTypes;

  @ForeignKey(() => Heros)
  @Column
  public heroId: string;
  @BelongsTo(() => Heros, "heroId")
  public hero: Heros;

  @Column(DataType.JSONB)
  public boxInfoCapture: BoxesTypes;

  @Column
  public createdBy: string;

  @Column
  public readyToUse: boolean;

  @Column
  public earnFrom: EarnFrom;
}
