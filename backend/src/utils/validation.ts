import Joi from "joi";

export const validate = (input: any) => {
  return {
    withSchema: (schema: Joi.ObjectSchema<any>) => {
      const validation = schema.validate(input);
      if (validation.error) {
        return {
          statusCode: 400,
          body: validation.value,
        };
      }
    },
  };
}
