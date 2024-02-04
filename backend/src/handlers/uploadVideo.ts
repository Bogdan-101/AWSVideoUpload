import { Context, APIGatewayProxyResult, APIGatewayEvent, S3Event } from "aws-lambda";
import { databaseService } from "../services/database.service";
import { videosService } from "../services/videos.service";
import { s3Service } from "../services/s3.service";
require("dotenv").config();

export const handler = async (
  event: S3Event,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
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
