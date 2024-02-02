// lib/s3-stack.ts
import * as cdk from "aws-cdk-lib/core";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

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
    });

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
