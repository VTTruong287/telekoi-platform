import { UpdateItemCommand, UpdateItemCommandInput, UpdateItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { CDK_CONFIGS } from "common/config/cdk-config";
import BaseModel from "common/dynamodb/base-model";

const CONTENT_COUNTER_TABLE_NAME = CDK_CONFIGS.contentCounterTableName;

export type ContentCounterType = {
  id: string;
  count: number;
};

export class ContentCounterModel extends BaseModel {
  constructor() {
    super(CONTENT_COUNTER_TABLE_NAME);

    this.setBigIntFieldNames(["count"]);
  }

  public async next(id: string) {
    const ddb = this.getDDB();

    const input: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: { id: { S: id } },
      UpdateExpression: "SET #count = #count + :incr",
      ExpressionAttributeNames: {
        "#count": "count"
      },
      ExpressionAttributeValues: { ":incr": { N: "1" } },
      ReturnValues: "UPDATED_NEW"
    };

    const command = new UpdateItemCommand(input);
    const output: UpdateItemCommandOutput = await ddb.send(command);
    return this._unmarshall(output.Attributes);
  }

  public get(keys: object) {
    return super._get<ContentCounterType>(keys);
  }
}
