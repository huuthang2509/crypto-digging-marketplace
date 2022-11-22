import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { EarnFrom, StatusCode } from "../base";
import { HerosBases } from "./hero-base";
import { Users } from "./user";

export interface IHeroStatistic {
  animationSpeed: number;
  moveSpeed: number;
  gemEarn: number;
  stamina: number;
}

export enum HeroStatus {
  Sleep = "sleep",
  Ready = "ready",
}

@Table({ tableName: "heros" })
export class Heros extends Model<Heros> {
  @Column
  public tokenId: string;

  @Column
  public readyToUse: boolean;

  @Column
  public status: StatusCode;

  @ForeignKey(() => HerosBases)
  @Column
  public quality: string;
  @BelongsTo(() => HerosBases, "quality")
  public baseInfo: HerosBases;

  @ForeignKey(() => Users)
  @Column
  public ownerId: string;
  @BelongsTo(() => Users, "ownerId")
  public owner: Users;

  @Column
  public earnFrom: EarnFrom;

  @Column
  public name: string;

  @Column
  public image: string;

  @Column
  public imageAssetName: string;

  @Column
  public description: string;

  @Column({ type: DataType.JSONB })
  public statistic: IHeroStatistic;

  @Column(DataType.DOUBLE)
  public currentStamina: number;

  @Column
  public restTime: Date;

  @Column
  public heroStatus: HeroStatus;
}
