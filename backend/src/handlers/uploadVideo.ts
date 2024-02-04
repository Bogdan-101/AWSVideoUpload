import { Context, APIGatewayProxyResult, S3Event } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { s3Service } from "../services/s3.service";
import { CustomError } from "../utils/customError";
require("dotenv").config();

export const handler = async (
  event: S3Event,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);

  try {
    const body = event.Records[0];
    const url = `https://${body.s3.bucket.name}.s3.${process.env["APP_AWS_REGION"]}.amazonaws.com/${body.s3.object.key}`;
    const objectMetadata = await s3Service.getObjectMetaData(body.s3.object.key);
  
    if (!objectMetadata) {
      console.log("TEST: error, no object metadata", objectMetadata);
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'No metadata was found',
        }),
      };
    }
    await databaseService.connect();
  
    const newVideo = await videosService.uploadVideo({
      name: objectMetadata["title"],
      description: objectMetadata["description"],
      duration: Math.floor(+objectMetadata["duration"]),
      uploaderId: objectMetadata["uploaderid"],
      key: body.s3.object.key,
      url,
    });
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        newVideo
      }),
    };
  } catch (error) {
    if (error instanceof CustomError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
        }),
      };
    }
    console.log(
      "An error appeared while processing the uploadVideo request, see the logs.",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "An error appeared while processing the uploadVideo request, see the logs.",
      }),
    };
  }
};
