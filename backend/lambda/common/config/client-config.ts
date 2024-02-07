import { fromIni } from "@aws-sdk/credential-providers";
import { loadSharedConfigFiles } from "@aws-sdk/shared-ini-file-loader";

type CommonAWSConfigType = {
  region?: string;
  credentials?: any;
};

let AWSConfig: CommonAWSConfigType = {};

export function getAWSConfig(): CommonAWSConfigType {
  return AWSConfig;
}

export async function AWSConfigureWithProfileName(profile: string) {
  const { configFile } = await loadSharedConfigFiles();

  AWSConfig.credentials = fromIni({ profile });

  if (configFile[profile] && AWSConfig.credentials) {
    AWSConfig.region = configFile[profile].region;
  }

  return AWSConfig;
}
