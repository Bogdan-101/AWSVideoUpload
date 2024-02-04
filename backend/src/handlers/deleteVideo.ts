import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import Joi from "joi";
import { validate } from "../utils/validation";
import { validateToken } from "../utils/user";
import { CustomError } from "../utils/customError";

const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  try {
    const jwtToken = event.headers["auth"]?.split(" ")[1] as string;
    const user = validateToken(jwtToken);
  
    const videoId =
      event.queryStringParameters && event.queryStringParameters["id"];
    validate({ id: videoId }).withSchema(idSchema);
  
    await databaseService.connect();
  
    //@ts-ignore
    await videosService.deleteVideo({ id: videoId, userId: user.id });
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        result: true,
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
        "An error appeared while processing the deleteVideo request, see the logs.",
        error
      );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "An error appeared while processing the deleteVideo request, see the logs.",
      }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  }
};
