#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CloudFrontStack } from '../lib/cloudfront-stack';
import { BackendStack } from '../lib/backend-stack';
import { S3Stack } from '../lib/s3-stack';
import { VpcStack } from '../lib/vpc-stack';
import { DataBaseStack } from '../lib/rds-stack';

const app = new cdk.App();
const stackS3 = new S3Stack(app, "TestTaskS3Stack", {
  env: { region: "us-east-2" },
});
const stackVpc = new VpcStack(app, "TestTaskVPCStack", {
  env: { region: "us-east-2" },
});
const stackRDS = new DataBaseStack(app, "TestTaskRDSStack", {
  env: { region: "us-east-2" },
  vpc: stackVpc.vpc
});
const stackCloudFront = new CloudFrontStack(
  app,
  "TestTaskCloudFrontStack",
  {
    env: { region: "us-east-2" },
    s3Stack: stackS3
  }
);
const stackBackend = new BackendStack(app, "TestTaskBackendStack", {
  env: { region: "us-east-2" }
});