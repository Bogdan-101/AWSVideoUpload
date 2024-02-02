import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  Peer,
  Port,
  SecurityGroup,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseSecret,
  PostgresEngineVersion,
} from "aws-cdk-lib/aws-rds";
import { Secret } from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface DataBaseStackProps extends StackProps {
  vpc: Vpc;
}

export class DataBaseStack extends Stack {
  public dbInstance: DatabaseInstance;
  constructor(scope: Construct, id: string, props: DataBaseStackProps) {
    super(scope, id, props);

    const engine = DatabaseInstanceEngine.postgres({
      version: PostgresEngineVersion.VER_13_7,
    });
    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
    const port = 5432;
    const dbName = "videos";

    // create database master user secret and store it in Secrets Manager
    // const masterUserSecret = new Secret(this, "db-master-user-secret", {
    //   secretName: "db-master-user-secret",
    //   description: "Database master user credentials",
    //   generateSecretString: {
    //     secretStringTemplate: JSON.stringify({ username: "postgres" }),
    //     generateStringKey: "password1234",
    //     passwordLength: 16,
    //     excludePunctuation: true,
    //   },
    // });

    const credentialsSecret = new Secret(
      this,
      `db-DBCredentialsSecret`,
      {
        secretName: `db-credentials`,
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: "postgres",
          }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password",
        },
      }
    ); 

    // Create a Security Group
    const dbSg = new SecurityGroup(this, "Database-SG", {
      securityGroupName: "Database-SG",
      vpc: props.vpc,
    });

    // Add Inbound rule
    dbSg.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(port),
      `Allow port ${port} for database connection from only within the VPC (${props.vpc.vpcId})`
    );

    // create RDS instance (PostgreSQL)
    this.dbInstance = new DatabaseInstance(this, "DB-1", {
      vpc: props.vpc,
      vpcSubnets: { subnetType: SubnetType.PUBLIC },
      instanceType,
      engine,
      port,
      publiclyAccessible: true,
      securityGroups: [dbSg],
      databaseName: dbName,
      credentials: Credentials.fromSecret(credentialsSecret),
      backupRetention: Duration.days(0), // disable automatic DB snapshot retention
      deleteAutomatedBackups: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DB connection settings will be appended to this secret (host, port, etc.)
    // masterUserSecret.attach(this.dbInstance);
  }
}
