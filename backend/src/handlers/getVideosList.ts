import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { validateToken } from "../utils/user";
import { CustomError } from "../utils/customError";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  try {
    const jwtToken = event.headers["auth"]?.split(" ")[1] as string;
    const user = validateToken(jwtToken);

    await databaseService.connect();

    const videoList = await videosService.getVideos(user.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: videoList,
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
        "An error appeared while processing the getVideoList request, see the logs.",
        error
      );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "An error appeared while processing the getVideoList request, see the logs."
      }),
    };
  }
};
