/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as Joi from "joi";

export function skipValueObject(input: object, valueSkip = [null, undefined]): any {
  if (!Object.keys(input).length) {
    return {};
  }

  return Object.keys(input).reduce((o, k) => (valueSkip.indexOf(input[k]) !== -1 ? o : { ...o, [k]: input[k] }), {});
}

const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      obj[key] = object[key];
    }

    return obj;
  }, {});
};

export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ["params", "query", "body"]);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" } })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(", ");
    return res.status(400).json({ errorMsg: errorMessage });
  }

  Object.assign(req, value);
  return next();
};
