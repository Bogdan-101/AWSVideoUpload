import { Stack, StackProps, Duration, CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";

export class VpcStack extends Stack {
  public vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define subnets.
    this.vpc = new ec2.Vpc(this, "VPC", {
      subnetConfiguration: [
        {
          name: "public-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
        {
          name: "isolated-subnet",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // Create log bucket.
    const s3LogBucket = new s3.Bucket(this, "s3LogBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      enforceSSL: true,
      versioned: true,
      accessControl: s3.BucketAccessControl.LOG_DELIVERY_WRITE,
      encryption: s3.BucketEncryption.S3_MANAGED,
      intelligentTieringConfigurations: [
        {
          name: "archive",
          archiveAccessTierTime: Duration.days(90),
          deepArchiveAccessTierTime: Duration.days(180),
        },
      ],
    });

    // Add flow logs.
    const vpcFlowLogRole = new iam.Role(this, "vpcFlowLogRole", {
      assumedBy: new iam.ServicePrincipal("vpc-flow-logs.amazonaws.com"),
    });
    s3LogBucket.grantWrite(vpcFlowLogRole, "sharedVpcFlowLogs/*");

    // Create flow logs to S3.
    new ec2.FlowLog(this, "sharedVpcLowLogs", {
      destination: ec2.FlowLogDestination.toS3(
        s3LogBucket,
        "sharedVpcFlowLogs/"
      ),
      trafficType: ec2.FlowLogTrafficType.ALL,
      flowLogName: "sharedVpcFlowLogs",
      resourceType: ec2.FlowLogResourceType.fromVpc(this.vpc),
    });

    // Create VPC endpoints for common services.
    this.vpc.addGatewayEndpoint("RDSEndpoint", {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    });
    this.vpc.addGatewayEndpoint("s3Endpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    // Create a shared security group.
    const allInboundAllOutboundSecurityGroup = new ec2.SecurityGroup(
      this,
      "allInboundAllOutboundSecurityGroup",
      {
        vpc: this.vpc,
        allowAllOutbound: true,
        description: "All inbound / all outbound",
        securityGroupName: "allInboundAllOutboundSecurityGroup",
      }
    );
    allInboundAllOutboundSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), 'Connection to the database')
    new CfnOutput(this, "allInboundAllOutboundSecurityGroupOutput", {
      exportName: "allInboundAllOutboundSecurityGroup",
      value: allInboundAllOutboundSecurityGroup.securityGroupId,
    });

    // Output the ID of the VPC.
    new CfnOutput(this, "sharedVpcId", {
      exportName: "shared-vpc-id",
      value: this.vpc.vpcId,
    });
  }
}
