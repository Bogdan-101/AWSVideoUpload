// lib/s3-stack.ts
import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";

export interface S3StackProps extends cdk.StackProps {
  // Add custom stack properties here if needed
}

export class S3Stack extends cdk.Stack {
  public readonly appBucket: s3.Bucket;
  public readonly lambdaOutputBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: S3StackProps) {
    super(scope, id, props);

    // Bucket for CloudFront-hosted application
    this.appBucket = new s3.Bucket(this, "CloudFrontBucket", {
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Bucket for Lambda function outputs
    this.lambdaOutputBucket = new s3.Bucket(this, "VideosBucket", {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.PUT,
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
    });


    const envs = {
      DB_HOST:
        "testtaskrdsstack-db1de0c8f27-8wqwkxijqosw.cd0a8ei2i224.us-east-2.rds.amazonaws.com",
      DB_USER: "postgres",
      DB_PASSWORD: "j4281kHqGT3xz6BfUTW0hsACL9gKv9u1",
      DB_PORT: "5432",
      DB_DATABASE: "videos",
      APP_AWS_REGION: "us-east-2",
      S3_BUCKET_NAME: this.lambdaOutputBucket.bucketName,
    };

    const uploadVideoFunction = new NodejsFunction(this, "upload", {
      entry: "backend/src/handlers/uploadVideo.ts",
      handler: "index.handler",
      environment: envs,
    });

    const s3PutEventSource = new lambdaEventSources.S3EventSource(
     this.lambdaOutputBucket,
      {
        events: [s3.EventType.OBJECT_CREATED],
        filters: [{suffix: '.mp4'}]
      }
    );

    uploadVideoFunction.addEventSource(s3PutEventSource);

    new cdk.CfnOutput(this, "CloudFrontBucketName", {
      value: this.appBucket.bucketName,
      description: "The name of the S3 bucket for cloudfront",
      exportName: "CloudFrontBucketName",
    });

    new cdk.CfnOutput(this, "VideosBucketName", {
      value: this.lambdaOutputBucket.bucketName,
      description: "The name of the S3 bucket for videos",
      exportName: "VideosBucketName",
    });
  }
}
