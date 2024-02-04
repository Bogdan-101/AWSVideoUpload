import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { execSync } from "child_process";
import path = require("path");
import { Bucket, EventType } from "aws-cdk-lib/aws-s3";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";


export interface CloudFrontStackProps extends cdk.StackProps {
  VideoBucket: Bucket;
}

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    super(scope, id, props);

    const envs = {
      DB_HOST:
        "testtaskrdsstack-db1de0c8f27-8wqwkxijqosw.cd0a8ei2i224.us-east-2.rds.amazonaws.com",
      DB_USER: "postgres",
      DB_PASSWORD: "j4281kHqGT3xz6BfUTW0hsACL9gKv9u1",
      DB_PORT: "5432",
      DB_DATABASE: "videos",
      APP_AWS_REGION: "us-east-2",
      S3_BUCKET_NAME: props.VideoBucket.bucketName,
      TOKEN_SECRET: 'token secret',
    };

    // creating a layer
    // const ffmegLayer = new lambda.LayerVersion(this, "ffmpeg-layer", {
    //   layerVersionName: "ffmpeg",
    //   code: lambda.AssetCode.fromAsset("ffmpeg"),
    // });

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
    // const uploadVideoFunction = new NodejsFunction(this, "upload", {
    //   entry: "backend/src/handlers/uploadVideo.ts",
    //   handler: "index.handler",
    //   // layers: [ffmegLayer],
    //   environment: envs,
    // });
    const uploadURLFunction = new NodejsFunction(this, "uploadURL", {
      entry: "backend/src/handlers/videoPreSignedURL.ts",
      handler: "index.handler",
      environment: envs,
    });
    const deleteVideoFunction = new NodejsFunction(this, "delete", {
      entry: "backend/src/handlers/deleteVideo.ts",
      handler: "index.handler",
      environment: envs,
    });

    // User endpoints
    const registerUserFunction = new NodejsFunction(this, "register", {
      entry: "backend/src/handlers/register.ts",
      handler: "index.handler",
      environment: envs,
    });
    const authUserFunction = new NodejsFunction(this, "auth", {
      entry: "backend/src/handlers/auth.ts",
      handler: "index.handler",
      environment: envs,
    });

    const apigw = new apigateway.RestApi(this, "apigw", {
      description: "An API Gateway for routing video processing functions",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
          "auth"
        ],
        allowCredentials: true,
      },
    });

    props.VideoBucket.grantPut(uploadURLFunction);
    props.VideoBucket.grantDelete(deleteVideoFunction);

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

    // const uploadLambdaPath = apigw.root.addResource("upload");
    // // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/upload

    // uploadLambdaPath.addMethod(
    //   "POST",
    //   new apigateway.LambdaIntegration(uploadVideoFunction)
    // );

    // GET uploadURL
    const uploadURLLambdaPath = apigw.root.addResource("uploadURL");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/uploadURL

    uploadURLLambdaPath.addMethod(
      "GET",
      new apigateway.LambdaIntegration(uploadURLFunction),
      {
        requestParameters: {
          "method.request.querystring.title": true,
          "method.request.querystring.description": true,
        },
      }
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

    // User paths

    // Post register
    const registerUserLambdaPath = apigw.root.addResource("register");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/register

    registerUserLambdaPath.addMethod(
      "POST",
      new apigateway.LambdaIntegration(registerUserFunction)
    );

    // Post auth
    const authUserLambdaPath = apigw.root.addResource("auth");
    // path name https://{createdId}.execute-api.{region}.amazonaws.com/prod/auth

    authUserLambdaPath.addMethod(
      "POST",
      new apigateway.LambdaIntegration(authUserFunction)
    );

    // Output the Lambda function ARN
    new cdk.CfnOutput(this, "getVideosURL", {
      value: getVideosLambdaPath.path,
    });

    new cdk.CfnOutput(this, "RestApiGatewayURL", {
      value: apigw.url!,
    });
  }
}
