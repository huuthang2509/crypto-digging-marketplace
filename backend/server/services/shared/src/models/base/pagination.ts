import { FindOptions, Model, OperatorsAliases, Order, OrderItem } from "sequelize";
import { ErrorKey } from "../../resources";
import { safeParseInt } from "./common";

export interface IPagingParams {
  page?: number;
  size?: number;
  order?: Order;
  nextPageToken?: string;
}

export interface IPaginationInfo {
  page?: number;
  size: number;
  totalPages?: number;
  totalPerPage?: number;
  total: number;
  nextPageToken?: string;
  randomSeed?: number;
}

export interface IPagingResult<T> {
  data: T[];
  pagination: IPaginationInfo;
}

export const PAGE_SIZE = 20;

export function parsePaginationParams(input: IPagingParamInput): IPagingParams {
  input = { ...input };

  return {
    page: safeParseInt(input.page, 1),
    size: safeParseInt(input.size, PAGE_SIZE),
    order: input.order || parseOrderParams(["-createdAt"]),
    nextPageToken: input.nextPageToken,
  };
}

export interface IPagingParamInput {
  page?: number;
  size?: number;
  order?: Order;
  nextPageToken?: string;
}

type TypeOrder = "-" | "+";

export function parseOrderParams<I = string>(input: I[] | I | Array<[I, TypeOrder]>): Order {
  if (Array.isArray(input)) {
    if (Array.isArray(input[0])) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      input = (input as Array<[I, TypeOrder]>).map((e) => `${e[0]}${e[1]}`) as unknown as I[];
    }
    input = (input as I[]).filter((e) => e);
    if (input.length === 0) {
      input = null;
    }
  }
  input = (input || ["-createdAt"]) as I | I[];
  function parseItem(item): OrderItem {
    if (typeof item !== "string") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return item;
    }

    return item.substring(0, 1) === "-" ? [item.substring(1), "DESC"] : [item, "ASC"];
  }
  if (typeof input === "string") {
    return [parseItem(input)];
  }

  return (input as I[]).map(parseItem);
}

export async function filterAll<I extends Model>(
  modelClass: (new () => I) & typeof Model,
  queryParams: FindOptions,
  pagingParams: IPagingParamInput,
): Promise<IPagingResult<I>> {
  const options = { ...parsePaginationParams(pagingParams) };
  const query = { order: options.order, ...queryParams };
  const data = (await modelClass.findAll(query)) as I[];

  return {
    data,
    pagination: {
      total: data.length,
      size: data.length,
      totalPages: 1,
      page: 1,
    },
  };
}

export interface IOptionFilterPagination {
  customQuery?: (model: typeof Model, query: any) => Promise<any>;
}

export async function filterPagination<I extends Model>(
  modelClass: (new () => I) & typeof Model,
  queryParams: FindOptions,
  pagingParams: IPagingParamInput,
  optionsFilters?: IOptionFilterPagination,
): Promise<IPagingResult<I>> {
  if (!pagingParams || (!pagingParams.page && !pagingParams.size)) {
    return filterAll<I>(modelClass, queryParams, pagingParams);
  }
  const page = pagingParams && pagingParams.page ? safeParseInt(pagingParams.page, 1) : 1;
  const options = {
    offset: 0,
    ...parsePaginationParams(pagingParams),
    page: page > 1 ? page : 1,
    limit: pagingParams && pagingParams.size ? safeParseInt(pagingParams.size, PAGE_SIZE) : PAGE_SIZE,
  };

  options.offset = options.offset || (options.page - 1) * options.limit;
  const query = {
    ...queryParams,
    order: queryParams.order || options.order,
    limit: options.limit,
    offset: options.offset,
  };

  let results: any = {};
  results =
    optionsFilters && optionsFilters.customQuery
      ? await optionsFilters.customQuery(modelClass, query)
      : await modelClass.findAndCountAll(query);

  if (results.rows.length === 0) {
    return defaultPagination(options.limit, options.page);
  }

  const totalPages =
    results.count % options.limit === 0 ? results.count / options.limit : Math.floor(results.count / options.limit) + 1;

  return {
    data: results.rows,
    pagination: {
      totalPages,
      page: options.page || 1,
      total: results.count,
      size: options.limit,
      totalPerPage: results.rows.length,
    },
  };
}

export interface IConfigPaginationInfinity {
  startField: string;
  operator: OperatorsAliases;
}

export async function filterPaginationInfinityByFieldStart<I extends Model>(
  modelClass: (new () => I) & typeof Model,
  queryParams: FindOptions,
  pagingParams: IPagingParamInput,
  config: IConfigPaginationInfinity,
): Promise<IPagingResult<I>> {
  const page = pagingParams && pagingParams.page ? safeParseInt(pagingParams.page, 1) : 1;

  const options = {
    ...parsePaginationParams(pagingParams),
    page: page > 1 ? page : 1,
    limit: safeParseInt(pagingParams && pagingParams.size, PAGE_SIZE),
  };

  if (pagingParams.nextPageToken) {
    const dataEncoded = decodeNextPage(pagingParams.nextPageToken);
    const convertToDate = new Date(dataEncoded);
    const whereForNextPageToken = {
      [config.startField]: {
        [<any>config.operator]:
          convertToDate instanceof Date && isFinite(<any>convertToDate) ? convertToDate : dataEncoded,
      },
    };
    queryParams.where = {
      ...(queryParams.where || queryParams.where),
      ...whereForNextPageToken,
    };
  }

  const query: any = {
    ...queryParams,
    order: queryParams.order || options.order,
    limit: options.limit,
  };
  const results = (await modelClass.findAll(query)) as I[];

  return {
    data: results,
    pagination: {
      total: results.length,
      size: options.limit,
      nextPageToken:
        results.length !== 0 && results.length === options.limit
          ? encodeNextPage(results[results.length - 1][config.startField])
          : null,
    },
  };
}

export async function filterPaginationInfinity<I extends Model>(
  modelClass: ((new () => I) & typeof Model) | any,
  queryParams: FindOptions,
  pagingParams: IPagingParamInput,
): Promise<IPagingResult<I>> {
  pagingParams = pagingParams || {};
  const page = safeParseInt(
    pagingParams.nextPageToken ? decodeNextPage(pagingParams.nextPageToken) : pagingParams.page,
    1,
  );

  const options = {
    offset: 0,
    ...parsePaginationParams(pagingParams),
    page: page > 1 ? page : 1,
    limit: pagingParams && pagingParams.size ? safeParseInt(pagingParams.size, PAGE_SIZE) : PAGE_SIZE,
  };

  options.offset = options.offset || (options.page - 1) * options.limit;
  const query = {
    ...queryParams,
    order: queryParams.order || options.order,
    limit: options.limit,
    offset: options.offset,
  };
  const results = (await modelClass.findAll(query)) as I[];

  return {
    data: results,
    pagination: {
      total: results.length,
      size: options.limit,
      nextPageToken: results.length !== 0 && results.length === options.limit ? encodeNextPage(options.page + 1) : null,
    },
  };
}

const PREFIX_NEXT_PAGE_TOKEN = "r2ws";

export function encodeNextPage(text: any) {
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return Buffer.from(PREFIX_NEXT_PAGE_TOKEN + text.toString()).toString("base64");
}

export function decodeNextPage(hash: string) {
  return Buffer.from(hash, "base64").toString("ascii").replace(PREFIX_NEXT_PAGE_TOKEN, "");
}

export function defaultPagination(size = PAGE_SIZE, page = 1) {
  return {
    data: [],
    pagination: {
      page,
      size,
      total: 0,
      totalPages: 0,
      totalPerPage: 0,
    },
  };
}

export async function findOrFail<I extends Model>(
  model: (new () => I) & typeof Model,
  query: string | number | FindOptions,
): Promise<I> {
  try {
    const result = await (typeof query === "object" ? model.findOne(query) : model.findByPk(query));
    if (!result) {
      return Promise.reject(ErrorKey.RecordNotFound);
    }

    return result as I;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function customFindAndCountAll(modelClass, queryParams, pagingParams, optionsFilters) {
  if (!pagingParams || (!pagingParams.page && !pagingParams.size)) {
    return filterAll(modelClass, queryParams, pagingParams);
  }
  const page = pagingParams && pagingParams.page ? safeParseInt(pagingParams.page, 1) : 1;
  const options = {
    offset: 0,
    ...parsePaginationParams(pagingParams),
    page: page > 1 ? page : 1,
    limit: pagingParams && pagingParams.size ? safeParseInt(pagingParams.size, PAGE_SIZE) : PAGE_SIZE,
  };
  options.offset = options.offset || (options.page - 1) * options.limit;

  const findAllAndCount = async (m, q) => {
    const rows = await m.findAll({
      ...queryParams,
      order: queryParams.order || options.order,
      limit: options.limit,
      offset: options.offset,
    });
    const count = await m.count({ ...q, ...optionsFilters });

    return { count, rows };
  };
  let results: any = {};
  results = await findAllAndCount(modelClass, queryParams);

  if (results.rows.length === 0) {
    return defaultPagination(options.limit, options.page);
  }
  const totalPages =
    results.count % options.limit === 0 ? results.count / options.limit : Math.floor(results.count / options.limit) + 1;

  return {
    data: results.rows,
    pagination: {
      totalPages,
      page: options.page || 1,
      total: results.count,
      size: options.limit,
      totalPerPage: results.rows.length,
    },
  };
}
