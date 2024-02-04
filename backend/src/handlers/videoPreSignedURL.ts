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
import { validateToken } from "../utils/user";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);

  try {
    const title =
      event.queryStringParameters && event.queryStringParameters["title"];
    const description =
      event.queryStringParameters && event.queryStringParameters["description"];
    const duration =
      event.queryStringParameters && event.queryStringParameters["duration"];
    const jwtToken = event.headers["auth"]?.split(" ")[1] as string;
    const user = validateToken(jwtToken);

    if (!title || !description) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "title or description is missing",
        }),
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        },
      };
    }
    const uploadURL = await s3Service.getPreSignedURL(
      title,
      description,
      duration,
      user.id
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadURL,
      }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  } catch (err) {
    console.error("Error generating pre-signed URL", err);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "check logs",
      }),
      headers: {
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      },
    };
  }
};
