import Joi from "joi";
import { CustomError } from "./customError";

export const validate = (input: any) => {
  return {
    withSchema: (schema: Joi.ObjectSchema<any>) => {
      const validation = schema.validate(input);
      if (validation.error) {
        throw new CustomError(422, validation.error.message)
      }
    }
  }
}
