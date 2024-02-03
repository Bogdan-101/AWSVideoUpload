import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import {
  ContainerTypes,
  ValidatedRequestSchema,
  createValidator,
} from "express-joi-validation";
import Joi from "joi";
import { validate } from "../utils/validation";
import { exec } from "child_process";
import { s3Service } from "../services/s3.service";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  try {
    const { description } = JSON.parse(event.body ?? "{}");
    const uploadURL = await s3Service.getPreSignedURL(description, 'test user');

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadURL,
      }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    };
  } catch (err) {
    console.error("Error generating pre-signed URL", err);
    return {
      statusCode: 200,
      body: JSON.stringify({
        error: "check logs",
      }),
    };
  }
};
