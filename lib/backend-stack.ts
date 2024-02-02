import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { execSync } from "child_process";
import path = require("path");

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const envs = {
      DB_HOST:
        "testtaskrdsstack-db1de0c8f27-8wqwkxijqosw.cd0a8ei2i224.us-east-2.rds.amazonaws.com",
      DB_USER: "postgres",
      DB_PASSWORD: "j4281kHqGT3xz6BfUTW0hsACL9gKv9u1",
      DB_PORT: "5432",
      DB_DATABASE: "videos",
      AWS_REGION: "us-east-2"
    };

    const getVideosFunctions = new NodejsFunction(this, "getVideos", {
      entry: "backend/src/handlers/getVideosList.ts",
      handler: "index.handler",
      environment: envs,
    });
    const getVideoFunctions = new NodejsFunction(this, "getVideo", {
      entry: "backend/src/handlers/getVideo.ts",
      handler: "index.handler",
      environment: envs,
    });
    const uploadVideoFunction = new NodejsFunction(this, "upload", {
      entry: "backend/src/handlers/uploadVideo.ts",
      handler: "index.handler",
      environment: envs,
    });
    const deleteVideoFunction = new NodejsFunction(this, "delete", {
      entry: "backend/src/handlers/deleteVideo.ts",
      handler: "index.handler",
      environment: envs,
    });
    const apigw = new apigateway.RestApi(this, "apigw", {
      description: "An API Gateway for routing video processing functions",
    });

    // GET getVideos
    const getVideosLambdaPath = apigw.root.addResource("getVideos");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/getVideos

    getVideosLambdaPath.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getVideosFunctions)
    );

    // GET getVideo
    const getVideoLambdaPath = apigw.root.addResource("getVideo");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/getVideo

    getVideoLambdaPath.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getVideoFunctions),
      {
        requestParameters: {
          "method.request.querystring.id": true,
        },
      }
    );

    // POST upload
    const uploadLambdaPath = apigw.root.addResource("upload");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/upload

    uploadLambdaPath.addMethod(
      "POST",
      new apigateway.LambdaIntegration(uploadVideoFunction)
    );

    // DELETE delete
    const deleteLambdaPath = apigw.root.addResource("delete");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/delete

    deleteLambdaPath.addMethod(
      "DELETE",
      new apigateway.LambdaIntegration(deleteVideoFunction),
      {
        requestParameters: {
          "method.request.querystring.id": true,
        },
      }
    );

    // Output the Lambda function ARN
    new cdk.CfnOutput(this, "getVideosURL", {
      value: getVideosLambdaPath.path,
    });

    new cdk.CfnOutput(this, "uploadURL", {
      value: uploadLambdaPath.path,
    });

    new cdk.CfnOutput(this, "RestApiGatewayURL", {
      value: apigw.url!,
    });
  }
}
