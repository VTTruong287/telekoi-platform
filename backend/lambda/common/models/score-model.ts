import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { convertToNative } from '@aws-sdk/util-dynamodb';
import BaseModel, { BaseScanCommandInput } from 'lambda/common/dynamodb/base-model';
import Joi from 'joi';

const TABLE_NAME = 'score';

enum SCAN_EXISTENCE {
  NONE = '',
  DELETED = 'deleted',
}

export type ScoreModelType = {
  PlayerID: string;
  Score: number;
  CreatedAt: number;
  UpdatedAt: number;
  DeletedAt: number;
};

const ScoreModelJoiSchema = Joi.object({
  title: Joi.string().min(4).max(60).required(),
  album_id: Joi.number().optional().allow(null),
  short_description: Joi.string().min(4).max(256).required(),
  genre: Joi.string().required(),
  album_art_url: Joi.string().optional().allow('').allow(null),
  download_url: Joi.string().optional().allow('').allow(null),
  sound_cloud_url: Joi.string().optional().allow('').allow(null),
  status: Joi.number().optional().allow(null),
});

export const ScoreModelCreateValidator = ScoreModelJoiSchema.fork(
  ['title', 'album_id', 'short_description', 'genre', 'album_art_url', 'download_url', 'sound_cloud_url'],
  (s) => s
).options({ allowUnknown: true, stripUnknown: true });

export const ScoreModelUpdateValidator = ScoreModelJoiSchema.fork(
  ['title', 'album_id', 'short_description', 'genre', 'album_art_url', 'download_url', 'sound_cloud_url', 'status'],
  (s) => s.optional().allow('').allow(null)
).options({ allowUnknown: true, stripUnknown: true });

export type ScoreModelScanOpts = {
  creatorId?: string;
  albumId?: number;
  title?: string;
  genre?: string;
  existence: SCAN_EXISTENCE;
  limit: number;
  pageKey?: Record<string, AttributeValue>;
};

export class ScoreModel extends BaseModel {
  constructor() {
    super(TABLE_NAME);
  }

  public scan(opts: ScoreModelScanOpts) {
    let indexName = undefined;
    let filterExpressions = [];
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};

    if (opts.creatorId) {
      indexName = 'index-score-gsi';
      filterExpressions.push('#creatorId = :creatorId');
      expressionAttributeNames['#creatorId'] = 'creator_id';
      expressionAttributeValues[':creatorId'] = { S: opts.creatorId };
    }

    if (opts.title) {
      filterExpressions.push('begins_with(#title, :title)');
      expressionAttributeNames['#title'] = 'title_lower';
      expressionAttributeValues[':title'] = { S: opts.title.toLowerCase() };
    }

    if (opts.genre) {
      filterExpressions.push('#genre = :genre');
      expressionAttributeNames['#genre'] = 'genre';
      expressionAttributeValues[':genre'] = { S: opts.genre };
    }

    if (opts.albumId) {
      filterExpressions.push('#albumId = :albumId');
      expressionAttributeNames['#albumId'] = 'album_id';
      expressionAttributeValues[':albumId'] = { N: opts.albumId.toString() };
    }

    switch (opts.existence) {
      case SCAN_EXISTENCE.DELETED:
        filterExpressions.push('#deletedAt > :zero');
        break;

      default:
        filterExpressions.push('#deletedAt = :zero');
        break;
    }
    expressionAttributeNames['#deletedAt'] = 'deleted_at';
    expressionAttributeValues[':zero'] = { N: '0' };

    let input: BaseScanCommandInput = {
      IndexName: indexName,
      FilterExpression: filterExpressions.join(' AND '),
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      Limit: opts.limit,
      ExclusiveStartKey: opts.pageKey,
    };

    return this._scan<ScoreModel>(input);
  }

  public update(keys: object, item: ScoreModelType, creatorId?: string) {
    let condition: any;
    if (creatorId) {
      condition = {
        ConditionExpression: '#creatorId = :conditionVal',
        ExpressionAttributeNames: {
          '#creatorId': 'creator_id',
        },
        ExpressionAttributeValues: {
          ':conditionVal': { S: creatorId },
        },
      };
    }

    return this._update<ScoreModelType>(keys, item, condition);
  }

  public put(item: ScoreModelType) {
    return this._put<ScoreModelType>(item);
  }

  public get(id: Number) {
    return super._get<ScoreModelType>({ id });
  }

  public async filterItemsByCreatorId(ids: Number[], creatorId: string) {
    const result = await this._batchGetItem(ids.map((id) => this._marshall({ id })));
    const items = result.Responses[this.tableName];
    return items.filter(function (item) {
      const myCreatorId = convertToNative(item.creator_id);
      return myCreatorId === creatorId;
    });
  }

  public batchUpdate(filteredItems: Record<string, AttributeValue>[], attributesToUpdate: any) {
    attributesToUpdate = this._marshall(attributesToUpdate);

    return this._batchWrite(
      filteredItems.map((item) => ({
        PutRequest: {
          Item: {
            ...item,
            ...attributesToUpdate,
          },
        },
      })),
      {
        ReturnConsumedCapacity: 'TOTAL',
        ReturnItemCollectionMetrics: 'NONE',
      }
    );
  }

  public generateLowerCaseFields(form: ScoreModelType): ScoreModelType {
    // if (form.title) {
    //   form.title_lower = form.title.toLowerCase();
    // }

    // if (form.short_description) {
    //   form.short_description_lower = form.short_description.toLowerCase();
    // }

    return form;
  }
}
