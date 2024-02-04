import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { s3Service } from "../services/s3.service";
import { validateToken } from "../utils/user";
import Joi from "joi";
import { validate } from "../utils/validation";
import { CustomError } from "../utils/customError";

const uploadUrlSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  duration: Joi.string().required(),
});

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
    validate({ title, description, duration }).withSchema(uploadUrlSchema);    
    
    const jwtToken = event.headers["auth"]?.split(" ")[1] as string;
    const user = validateToken(jwtToken);

    if (!title || !description || !duration) {
      throw new CustomError(400, "title, description or duration is missing");
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
      "An error appeared while processing the videoPreSignedURL request, see the logs.",
      error
    );
    return {
      statusCode: 500,
      body: JSON.stringify({
        message:
          "An error appeared while processing the videoPreSignedURL request, see the logs.",
      }),
    };
  }
};
