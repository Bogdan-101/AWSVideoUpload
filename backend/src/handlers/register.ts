import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { validate } from "../utils/validation";
import Joi from "joi";

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
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "An error occureed",
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
