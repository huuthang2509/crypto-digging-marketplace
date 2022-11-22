import { Column, Model, Table } from "sequelize-typescript";
import { HeroBoxesType } from "./box-type";
import { MarketRefType } from "./marketplace";

@Table({ tableName: "nft_mint_logs" })
export class NftMintLogs extends Model<NftMintLogs> {
  @Column
  public quality: HeroBoxesType;

  @Column
  public tokenId: string;

  @Column
  public refId: string;

  @Column
  public refType: MarketRefType;

  @Column
  public ownerId: string;
}
