import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import Joi from "joi";
import { validate } from "../utils/validation";

const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const videoId = event.queryStringParameters && event.queryStringParameters["id"];
  validate({ id: videoId }).withSchema(idSchema);

  await databaseService.connect();

  //@ts-ignore
  await videosService.deleteVideo({ id: videoId });

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: true,
    }),
  };
};
