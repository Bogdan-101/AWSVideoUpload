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

    // Defines the Lambda function for video processing
    // TODO: pass a region in props
    // TODO: pass an account id in props
    // Using community FFmpegLayer
    // const videoProcessingLambda = new lambda.Function(
    //   this,
    //   "VideoProcessingHandler",
    //   {
    //     runtime: lambda.Runtime.NODEJS_20_X, // Ensure compatibility with your FFmpeg layer
    //     code: lambda.Code.fromAsset("backend"), // Your Lambda function code directory
    //     handler: "index.handler", // Adjust handler name as necessary
    //     // layers: [
    //     //   lambda.LayerVersion.fromLayerVersionArn(
    //     //     this,
    //     //     "FFmpegLayer",
    //     //     "https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:145266761615:applications~ffmpeg-lambda-layer"
    //     //   ),
    //     // ],
    //     // Increase timeout and memory based on expected video processing times and file sizes
    //     timeout: cdk.Duration.minutes(5),
    //     memorySize: 3008,
    //   }
    // );

    // const restApi = new apigateway.RestApi(this, "SSOBackendApi", {
    //   restApiName: "VideoProcessing REST API"
    // });

    // // Integrate API Gateway with Lambda
    // const integration = new apigateway.LambdaIntegration(
    //   videoProcessingLambda,
    //   {
    //     requestTemplates: { "application/json": '{ "statusCode": "200" }' },
    //   }
    // );

    // const proxyResource = restApi.root.addResource("{proxy+}"); // Catch-all for any subpath
    // // proxyResource.addMethod('ANY', integration); // ANY method (GET, POST, PUT, DELETE, etc.)
    // proxyResource.addMethod(
    //   "ANY",
    //   new apigateway.LambdaIntegration(videoProcessingLambda)
    // );

    // Build and prune the Lambda code (for convenience here. Typically this would be done using a separate build pipeline)
    // const buildLambdaCode = (lambdaPath: string) => {
    //   console.log(`Building Lambda function at ${lambdaPath}`);
    //   execSync("npm install && npm run build", {
    //     cwd: lambdaPath,
    //     stdio: "inherit",
    //   });
    //   execSync("npm prune --production", { cwd: lambdaPath, stdio: "inherit" });
    // };

    // const lambdaPath = path.resolve(__dirname, "../backend");

    // // Build and prune Lambda code
    // buildLambdaCode(lambdaPath);

    // const videoFunction = new NodejsFunction(this, "function", {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   entry: "dist/index.js",
    //   handler: "dist/index.js",
    // });
    // Define the Lambda function
    // const videoFunction = new lambda.Function(this, "VideoProcessLambda", {
    //   runtime: lambda.Runtime.NODEJS_20_X,
    //   handler: "dist/src/index.handler",
    //   code: lambda.Code.fromAsset(lambdaPath)
    // });
    // const apigw = new apigateway.LambdaRestApi(this, "apigw", {
    //   handler: videoFunction,
    // });

    const videoFunction = new NodejsFunction(this, "function", {
      entry: "backend/src/handlers/index.ts",
      handler: "index.handler",
      environment: {
        DB_HOST:
          "testtaskrdsstack-db1de0c8f27-8wqwkxijqosw.cd0a8ei2i224.us-east-2.rds.amazonaws.com",
        DB_USER: "postgres",
        DB_PASSWORD: "j4281kHqGT3xz6BfUTW0hsACL9gKv9u1",
        DB_PORT: "5432",
        DB_DATABASE: "videos",
      },
    });
    const apigw = new apigateway.LambdaRestApi(this, "apigw", {
      handler: videoFunction,
    });

    // Output the Lambda function ARN
    new cdk.CfnOutput(this, "FunctionARN", {
      value: videoFunction.functionArn,
    });

    new cdk.CfnOutput(this, "RestApiGatewayURL", {
      value: apigw.url!,
    });
  }
}
