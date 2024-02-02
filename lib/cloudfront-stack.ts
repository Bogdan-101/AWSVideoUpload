// lib/cloudfront-stack.ts
import * as cdk from "aws-cdk-lib/core";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import { S3Stack } from "./s3-stack";
import { Construct } from "constructs";
import path = require("path");

export interface CloudFrontStackProps extends cdk.StackProps {
  s3Stack: S3Stack;
}

export class CloudFrontStack extends cdk.Stack {
  public distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: CloudFrontStackProps) {
    super(scope, id, props);

    // Use the appBucket for the CloudFront distribution
    const appBucket = props.s3Stack.appBucket;

    // Create a CloudFront distribution for the appBucket
    this.distribution = new cloudfront.Distribution(
      this,
      "CloudfrontDistribution",
      {
        defaultBehavior: {
          origin: new origins.S3Origin(appBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        defaultRootObject: "index.html",
        errorResponses: [
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: "/index.html",
          },
        ],
      }
    );

    new s3deploy.BucketDeployment(this, "BucketDeployment", {
      sources: [s3deploy.Source.asset('client/build')],
      destinationBucket: appBucket,
      distribution: this.distribution,
      distributionPaths: ["/*"],
    });

    new cdk.CfnOutput(this, "CloudFrontURL", {
      value: this.distribution.domainName,
      description: "The distribution URL",
      exportName: "CloudfrontURL",
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: appBucket.bucketName,
      description: "The name of the S3 bucket",
      exportName: "BucketName",
    });
  }
}
