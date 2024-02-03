import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { ContainerTypes, ValidatedRequestSchema, createValidator } from "express-joi-validation";
import Joi from "joi";
import { validate } from "../utils/validation";
import { exec } from "child_process";

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
  console.log(`request context: ${JSON.stringify(event.requestContext, null, 2)}`);
  console.log(
    `resource: ${JSON.stringify(event.resource, null, 2)}`
  );
  console.log(`body: ${JSON.stringify(event.body, null, 2)}`);

  const { name, description, uploaderId } = JSON.parse(event.body ?? '{}');
  const body = {
    name, description, uploaderId
  }
  validate(body).withSchema(uploadSchema);

  await databaseService.connect();

  // const newVideo = await videosService.uploadVideo(body, '');

  return {
    statusCode: 200,
    body: JSON.stringify({
      newVideo: ''
    }),
  };
};

const ev = {
  "Records": [
    {
      "eventVersion": "2.1",
      "eventSource": "aws:s3",
      "awsRegion": "us-east-2",
      "eventTime": "2024-02-03T12:41:37.767Z",
      "eventName": "ObjectCreated:Put",
      "userIdentity": {
        "principalId": "AWS:AROA47CRVMWTBALHL4HFN:TestTaskBackendStack-uploadURL083EB04B-bbg4o5zK8Yl5"
      },
      "requestParameters": {
        "sourceIPAddress": "31.60.140.7"
      },
      "responseElements": {
        "x-amz-request-id": "YN46F0DR7TE938PJ",
        "x-amz-id-2": "34KyJUcaCh9UfCKNu0GZpCgaQ8WmyU7VhG3ok5OY9oVGD0ueXqZUHmrUYKTFBDk9tuJqMwlGS3wZiKG1clwd8DWC2tu1k1KV"
      },
      "s3": {
        "s3SchemaVersion": "1.0",
        "configurationId": "OGE0NGFkMTgtZTdiNy00YzE0LTg3ZmYtMGVmOWYwOTc1MjQ4",
        "bucket": {
          "name": "testtasks3stack-videosbucket75f673ed-vipkw5ngfjrf",
          "ownerIdentity": {
            "principalId": "ASGS17B25BUND"
          },
          "arn": "arn:aws:s3:::testtasks3stack-videosbucket75f673ed-vipkw5ngfjrf"
        },
        "object": {
          "key": "videos/1706964093073-0.5550188152754538.mp4",
          "size": 1570024,
          "eTag": "d9061d3da8601932e98f79ec8ba1c877",
          "sequencer": "0065BE3481AD9CFFE3"
        }
      }
    }
  ]
}
