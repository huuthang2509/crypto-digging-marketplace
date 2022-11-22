import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { StatusCode } from "../base";
import { Users } from "./user";

export enum GameStatus {
  Created = "created",
  OnGoing = "on_going",
  Ended = "ended",
}

@Table({ tableName: "game_plays" })
export class GamePlays extends Model<GamePlays> {
  @Column
  public status: StatusCode;

  @Column
  public gameStatus: GameStatus;

  @ForeignKey(() => Users)
  @Column
  public createdBy: string;
  @BelongsTo(() => Users, "createdBy")
  public createdUser: Users;

  @ForeignKey(() => Users)
  @Column
  public updatedBy: string;
  @BelongsTo(() => Users, "updatedBy")
  public updatedUser: Users;

  @Column
  public profitLevel: number;

  @Column
  public speedLevel: number;

  @Column
  public workerLevel: number;

  @Column(DataType.JSONB)
  public logs: object[];

  @Column(DataType.JSONB)
  public heroSpawneds: string[];
}
