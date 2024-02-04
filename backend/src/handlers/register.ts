import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { validate } from "../utils/validation";
import Joi from "joi";
import { CustomError } from "../utils/customError";

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  try {
    const { username, password } = JSON.parse(event.body ?? "{}");
    validate({ username, password }).withSchema(registerSchema);

    await databaseService.connect();

    //@ts-ignore
    const { passwordHash, ...otherAttr } = await databaseService.registerUser({
      username,
      password,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        user: otherAttr,
      }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
        }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        },
      };
    }
      console.log(
        "An error appeared while processing the register request, see the logs.",
        error
      );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "An error appeared while processing the register request, see the logs.",
        error: error,
      }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  }
};
