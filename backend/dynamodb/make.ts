import 'dotenv/config';
import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY || '',
    secretAccessKey: process.env.AWS_ACCESS_SECRET || ''
  },
  region: process.env.AWS_REGION
});

export const main = async () => {
  const command = new CreateTableCommand({
    TableName: "dev-sample-score",
    AttributeDefinitions: [
      {
        AttributeName: "PlayerID",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "PlayerID",
        KeyType: "HASH",
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  });

  const response = await client.send(command);
  console.log(response);
  return response;
};



// main();
