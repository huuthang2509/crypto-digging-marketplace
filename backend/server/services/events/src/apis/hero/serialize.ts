import moment from "moment-timezone";
import { Heros, Marketplace, MarketRefType, SaleStatus, StatusCode } from "shared";

export async function serializeHeroResponse(data: Heros[]): Promise<any> {
  const onMarketItemIds = (
    await Marketplace.findAll({
      where: {
        status: StatusCode.Active,
        saleStatus: SaleStatus.OnMarket,
        refId: data.map((e) => e.id),
        refType: MarketRefType.Hero,
      },
      attributes: ["refId"],
    })
  ).map((e) => e.refId);

  return data.map((e) => ({
    ...e.get(),
    isOnMarket: onMarketItemIds.includes(e.id),
  }));
}

const regainStaminaRate = 0.1;
export function standardizeAppHero(data: Heros): any {
  return {
    ...data.get(),
    currentStamina: data.restTime
      ? Math.min(
          +data.currentStamina + +(moment().diff(moment(data.restTime), "hours") * regainStaminaRate),
          data.statistic.stamina,
        )
      : +data.currentStamina,
  };
}
