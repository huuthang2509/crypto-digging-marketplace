import { Column, Model, Table } from "sequelize-typescript";
import { HeroBoxesType } from "./box-type";
import { MarketRefType } from "./marketplace";

@Table({ tableName: "nft_define_quanties" })
export class NftDefineQuantities extends Model<NftDefineQuantities> {
  @Column
  public refType: MarketRefType;

  @Column
  public totalSupply: number;

  @Column
  public totalMint: number;

  @Column
  public quality: HeroBoxesType;
}
