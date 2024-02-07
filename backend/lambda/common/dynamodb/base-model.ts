import {
  AttributeValue,
  BatchGetItemCommand,
  BatchGetItemCommandInput,
  BatchWriteItemCommand,
  BatchWriteItemCommandInput,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput,
  QueryCommandOutput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput,
  TransactWriteItemsCommand,
  TransactWriteItemsCommandInput,
  TransactWriteItemsCommandOutput,
  UpdateItemCommand,
  UpdateItemCommandInput,
  UpdateItemCommandOutput
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { getAWSConfig } from "common/config/client-config";

let ddbClient: DynamoDBClient;

export type BaseQueryCommandInput = Omit<QueryCommandInput, "TableName"> &
  Partial<Pick<QueryCommandInput, "TableName">>;
export type BaseScanCommandInput = Omit<ScanCommandInput, "TableName"> & Partial<Pick<ScanCommandInput, "TableName">>;

export default class BaseModel {
  protected tableName: string;
  protected bigIntFieldNames: string[];

  constructor(tableName: string) {
    this.tableName = tableName;
    this.bigIntFieldNames = [];
  }

  getDDB() {
    if (!ddbClient) {
      const awsConfig = getAWSConfig();
      ddbClient = new DynamoDBClient(awsConfig);
    }

    return ddbClient;
  }

  _createPutTransaction<T>(item: T): any {
    return {
      Put: {
        TableName: this.tableName,
        Item: this._marshall(item)
      }
    };
  }

  async _put<T>(item: T) {
    const ddb = this.getDDB();

    const input: PutItemCommandInput = {
      TableName: this.tableName,
      Item: this._marshall(item)
    };

    const command = new PutItemCommand(input);
    const output: PutItemCommandOutput = await ddb.send(command);
    return output;
  }

  async _get<T>(keys: object): Promise<T> {
    const ddb = this.getDDB();

    const input: GetItemCommandInput = {
      TableName: this.tableName,
      Key: marshall(keys)
    };

    const command = new GetItemCommand(input);
    const output: GetItemCommandOutput = await ddb.send(command);
    const result = output && output.Item ? this._unmarshall(output.Item) : {};

    return result as T;
  }

  async _update<T>(keys: object, attributesToUpdate: T, condition?: any) {
    const ddb = this.getDDB();

    condition = condition || {};

    let updateExpression = "SET ";
    let expressionAttributeValues = {...condition.ExpressionAttributeValues};
    let expressionAttributeNames = {...condition.ExpressionAttributeNames};

    Object.entries(this._marshall(attributesToUpdate)).forEach(([key, value], index) => {
      const attributeKey = `#attr${index}`;
      const attributeValue = `:val${index}`;
      updateExpression += `${attributeKey} = ${attributeValue}, `;
      expressionAttributeNames[attributeKey] = key;
      expressionAttributeValues[attributeValue] = value;
    });

    // Remove the trailing comma and space from the update expression
    updateExpression = updateExpression.slice(0, updateExpression.length - 2);

    const input: UpdateItemCommandInput = {
      TableName: this.tableName,
      Key: marshall(keys),
      ReturnValues: "UPDATED_NEW",
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ConditionExpression: condition.ConditionExpression
    };

    const command = new UpdateItemCommand(input);
    const output: UpdateItemCommandOutput = await ddb.send(command);
    return output.Attributes;
  }

  async _scan<T>(params: BaseScanCommandInput) {
    const ddb = this.getDDB();

    const result = {
      data: [] as T[],
      count: 0,
      nextPageKey: null
    };

    const input: ScanCommandInput = {
      TableName: this.tableName,
      ...params
    };

    const command = new ScanCommand(input);
    const output: ScanCommandOutput = await ddb.send(command);

    result.data = output.Items.map((i) => this._unmarshall(i)) as T[];
    result.count += output.Count;
    result.nextPageKey = output.LastEvaluatedKey;

    return result;
  }

  async _scanAll<T>(params: BaseScanCommandInput) {
    const ddb = this.getDDB();

    let lastEvaluatedKey: Record<string, AttributeValue>;

    const result = {
      data: [] as T[],
      count: 0
    };

    const input: ScanCommandInput = {
      TableName: this.tableName,
      ...params
    };

    do {
      const command = new ScanCommand(input);
      const output: ScanCommandOutput = await ddb.send(command);
      const unmarshalled = output.Items.map((i) => this._unmarshall(i)) as T[];

      result.data.push(...unmarshalled);
      result.count += output.Count;
      lastEvaluatedKey = output.LastEvaluatedKey;

      if (lastEvaluatedKey) {
        input.ExclusiveStartKey = lastEvaluatedKey;
      }
    } while (lastEvaluatedKey);

    return result;
  }

  async _query(params: BaseQueryCommandInput) {
    const ddb = this.getDDB();

    const result = {
      data: [],
      count: 0,
      nextPageKey: null
    };

    const input: QueryCommandInput = {
      TableName: this.tableName,
      ...params
    };

    const command = new QueryCommand(input);
    const output: QueryCommandOutput = await ddb.send(command);

    result.data = output.Items.map((i) => this._unmarshall(i));
    result.count += output.Count;
    result.nextPageKey = output.LastEvaluatedKey;

    return result;
  }

  async _queryAll(params: BaseQueryCommandInput) {
    const ddb = this.getDDB();

    let lastEvaluatedKey: Record<string, AttributeValue>;

    const result = {
      data: [],
      count: 0
    };

    const input: QueryCommandInput = {
      TableName: this.tableName,
      ...params
    };

    do {
      const command = new QueryCommand(input);
      const output: QueryCommandOutput = await ddb.send(command);
      const unmarshalled = output.Items.map((i) => this._unmarshall(i));

      result.data.push(...unmarshalled);
      result.count += output.Count;
      lastEvaluatedKey = output.LastEvaluatedKey;

      if (lastEvaluatedKey) {
        input.ExclusiveStartKey = lastEvaluatedKey;
      }
    } while (lastEvaluatedKey);

    return result;
  }

  async _batchWrite(params: any[], opts?: any) {
    const ddb = this.getDDB();

    const input: BatchWriteItemCommandInput = {
      RequestItems: {
        [this.tableName]: params
      },
      ...opts
    };

    const command = new BatchWriteItemCommand(input);
    const result = await ddb.send(command);
    return result;
  }

  async _batchGetItem(params: any[], opts?: any) {
    const ddb = this.getDDB();

    const input: BatchGetItemCommandInput = {
      RequestItems: {
        [this.tableName]: { Keys: params }
      },
      ...opts
    };

    const command = new BatchGetItemCommand(input);
    const result = await ddb.send(command);
    return result;
  }

  async _deleteItem<T>(keys: object) {
    const ddb = this.getDDB();

    const input: DeleteItemCommandInput = {
      TableName: this.tableName,
      Key: marshall(keys)
    };

    const command = new DeleteItemCommand(input);

    const output: DeleteItemCommandOutput = await ddb.send(command);
    return output;
  }

  async _transactWriteItems<T>(transactItems: any) {
    const ddb = this.getDDB();

    const input: TransactWriteItemsCommandInput = {
      TransactItems: transactItems
    };

    const command = new TransactWriteItemsCommand(input);

    const output: TransactWriteItemsCommandOutput = await ddb.send(command);
    return output;
  }

  _unmarshall(obj) {
    if (!obj) {
      return null;
    }

    const res = unmarshall(obj);
    this.bigIntFieldNames.forEach((field) => (res[field] = BigInt(res[field])));
    return res;
  }

  _marshall(obj) {
    return marshall(obj, { removeUndefinedValues: true });
  }

  protected setBigIntFieldNames(names: string[]) {
    this.bigIntFieldNames = names;
  }
}
