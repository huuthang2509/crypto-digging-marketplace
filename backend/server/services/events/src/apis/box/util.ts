import { Boxes, HeroBoxesType, NftDefineQuantities, safeParseInt } from "shared";

export function getRandomHeroType(box: Boxes) {
  const { commonRatio, rareRatio, epicRatio, legendRatio } = box.boxInfo;
  const seedRate = [
    { name: HeroBoxesType.Common, percent: commonRatio },
    { name: HeroBoxesType.Epic, percent: epicRatio },
    { name: HeroBoxesType.Legend, percent: legendRatio },
    { name: HeroBoxesType.Rare, percent: rareRatio },
  ];
  const expanded = seedRate.flatMap((seed) => Array(safeParseInt(seed.percent)).fill(seed));
  const shuffledArr = expanded.sort(() => 0.5 - Math.random());

  return shuffledArr[Math.floor(Math.random() * shuffledArr.length)].name;
}

export const changeFormatArrayToObjectByKeyValue = (arr: any[], key: string) => {
  return arr.reduce((prev, curr) => {
    const keyValue = curr[key];
    delete curr[key];

    const objectElement = {
      [keyValue]: {
        ...curr,
      },
    };
    return {
      ...prev,
      ...objectElement,
    };
  }, {});
};

const shuffledArray = (expanded) => expanded.sort(() => 0.5 - Math.random());

export const getRandomHeroTypeV2 = async (box?: Boxes, refType = "hero") => {
  const heroExist = await NftDefineQuantities.findAll({
    attributes: ["totalSupply", "totalMint", "quality"],
    raw: true,
    where: {
      refType,
    },
  });
  const formatData = changeFormatArrayToObjectByKeyValue(heroExist, "quality");

  const { commonRatio, rareRatio, epicRatio, legendRatio } = box.boxInfo;
  const seedRate = [
    { name: HeroBoxesType.Common, percent: commonRatio },
    { name: HeroBoxesType.Epic, percent: epicRatio },
    { name: HeroBoxesType.Legend, percent: legendRatio },
    { name: HeroBoxesType.Rare, percent: rareRatio },
  ];
  const expanded = seedRate.flatMap((seed) => {
    const initItem = {
      exist: 1,
      total: 1,
    };
    if (formatData[seed.name]) {
      initItem.exist = formatData[seed.name].totalSupply - formatData[seed.name].totalMint;
      initItem.total = formatData[seed.name].totalSupply;
    }
    return Array(safeParseInt(Math.floor((seed.percent * initItem.exist) / initItem.total))).fill(seed);
  });
  const shuffledArr = shuffledArray(expanded);

  return shuffledArr[Math.floor(Math.random() * shuffledArr.length)].name;
};

const weightedRand = (spec) => {
  const table = [];
  for (const i in spec) {
    // The constant 10 below should be computed based on the
    // weights in the spec for a correct and optimal table size.
    // E.g. the spec {0:0.999, 1:0.001} will break this impl.
    for (let j = 0; j < spec[i] * 20; j++) {
      table.push(i);
    }
  }
  const shuffledArr = shuffledArray(table);
  return shuffledArr[Math.floor(Math.random() * table.length)];
};

/**
 * Random in Range
 * @param from
 * @param to
 * @returns
 */
export const getRandomNumberInRange = (from: number, to: number): number => {
  const sumOfAllValue = ((to - from + 1) * (to + from)) / 2;
  const normalDistribution = [...Array.from(Array(to - from + 1))].reduce((prev, curr, index) => {
    return Object.assign(prev, {
      [index + from]: (to - index) / sumOfAllValue,
    });
  }, {});
  return weightedRand(normalDistribution);
};
