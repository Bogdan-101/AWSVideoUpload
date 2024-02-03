import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { validate } from "../utils/validation";
import Joi from "joi";
import { validateToken } from "../utils/user";

const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  
  const jwtToken = event.headers["auth"]?.split(" ")[1] as string;
  const user = validateToken(jwtToken);

  const videoId = event.queryStringParameters && event.queryStringParameters['id'];
  validate({id: videoId}).withSchema(idSchema);
  
  await databaseService.connect();

  //@ts-ignore
  const video = await videosService.getVideo({id: videoId});

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: video,
    }),
  };
};
