import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
import { StatusCode } from "../base";

export interface IHeroData {
  name: string;
  image: string;
  imageAssetName: string;
  description: string;
}

@Table({ tableName: "heros_bases" })
export class HerosBases extends Model<HerosBases> {
  @PrimaryKey
  @Column
  public type: string; // BoxesTypes

  @Column
  public status: StatusCode;

  @Column(DataType.JSONB)
  public animationSpeedRange: number[];

  @Column(DataType.JSONB)
  public moveSpeedRange: number[];

  @Column(DataType.JSONB)
  public gemEarnRange: number[];

  @Column(DataType.JSONB)
  public staminaRange: number[];

  @Column(DataType.JSONB)
  public data: IHeroData[];
}
