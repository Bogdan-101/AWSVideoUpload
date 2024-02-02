import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { ContainerTypes, ValidatedRequestSchema, createValidator } from "express-joi-validation";
import Joi from "joi";
import { validate } from "../utils/validation";

const validator = createValidator();

const paginationSchema = Joi.object({
  limit: Joi.number().default(25),
  offset: Joi.number().default(0),
});

const idSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

const uploadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
});

interface PaginationSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    limit: number;
    offset: number;
  };
}

interface IdSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  const { name, description, uploaderId } = JSON.parse(event.body ?? '{}');
  const body = {
    name, description, uploaderId
  }
  validate(body).withSchema(uploadSchema);

  await databaseService.connect();

  const newVideo = await videosService.uploadVideo(body);

  return {
    statusCode: 200,
    body: JSON.stringify({
      newVideo
    }),
  };
};
