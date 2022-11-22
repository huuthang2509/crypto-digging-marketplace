import { Column, Model, Table } from "sequelize-typescript";

export enum HeroBoxesType {
  Common = "common",
  Rare = "rare",
  Epic = "epic",
  Legend = "legend",
}

@Table({ tableName: "boxes_types" })
export class BoxesTypes extends Model<BoxesTypes> {
  @Column
  public name: string;

  @Column
  public CDGPrice: number;

  @Column
  public img: string;

  @Column
  public boxType: HeroBoxesType;

  @Column
  public commonRatio: number;

  @Column
  public rareRatio: number;

  @Column
  public epicRatio: number;

  @Column
  public legendRatio: number;
}
