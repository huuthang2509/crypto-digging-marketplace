import * as SequelizeInstance from "sequelize";
import { Model, Repository, Sequelize, SequelizeOptions } from "sequelize-typescript";

export type ModuleModel = "digging";

export type ModelCtor<M extends Model = Model> = Repository<M>;
export type IInputModel<Module = any> = Module | ModelCtor[];
export type ISequelizeOption = SequelizeInstance.ReplicationOptions | SequelizeOptions;

interface IOptionGetModel {
  basePathRequireModel?: string;
  folderModel?: string;
}

interface IFunction {
  name: string;
  prototype: string;
}

function defaultSequelizeConfig() {
  return {
    dialect: "postgres",
    pool: {
      max: process.env.MAX_POOL_CONNECTION || 10,
      min: process.env.MIN_POOL_CONNECTION || 0,
    },
    logQueryParameters: true,
    benchmark: true,
    models: null,
  };
}

function parseSequelizeConfig(config: SequelizeInstance.ReplicationOptions | SequelizeOptions) {
  return { ...defaultSequelizeConfig(), ...config };
}

function getModelsByModule(param: string, getModelOptions: IOptionGetModel = {}) {
  let { basePathRequireModel } = getModelOptions;
  basePathRequireModel = basePathRequireModel || "..";
  return Object.values(param ? require(`${basePathRequireModel}/${param}`) : require(`${basePathRequireModel}`)).filter(
    (e: IFunction) =>
      (e === null || e === undefined ? undefined : e.name) && (e === null || e === undefined ? undefined : e.prototype),
  );
}

function initSequelize(
  sequelizeInstance: any,
  param: IInputModel,
  opts: SequelizeInstance.ReplicationOptions | SequelizeOptions,
  getModelOptions?: IOptionGetModel,
): Sequelize {
  console.log(`Database is being setup`, param || "");

  const option = parseSequelizeConfig(opts);
  option.models = typeof param === "string" || param === null ? getModelsByModule(param, getModelOptions) : param;
  return new (sequelizeInstance !== null && sequelizeInstance !== undefined ? sequelizeInstance : Sequelize)(
    option,
  ) as Sequelize;
}

export function initDatabase(models: IInputModel<ModuleModel>, opts: ISequelizeOption) {
  return initSequelize(null, models, opts, {
    basePathRequireModel: __dirname,
  });
}

export * from "./base";
export * from "./digging";
