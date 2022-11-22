import { Boxes, Marketplace, MarketRefType, SaleStatus, StatusCode } from "shared";

export async function serializeBoxResponse(data: Boxes[]) {
  const onMarketItemIds = (
    await Marketplace.findAll({
      where: {
        status: StatusCode.Active,
        saleStatus: SaleStatus.OnMarket,
        refId: data.map((e) => e.id),
        refType: MarketRefType.Box,
      },
      attributes: ["refId"],
    })
  ).map((e) => e.refId);

  return data.map((e) => ({
    ...e.get(),
    isOnMarket: onMarketItemIds.includes(e.id),
  }));
}
