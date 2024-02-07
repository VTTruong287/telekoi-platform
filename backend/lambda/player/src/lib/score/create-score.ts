import { ErrorWithStatus } from "common/config/errors";
import { ContentCounterModel } from "common/dynamodb/content-counter-model";

import { ScoreModel, ScoreModelCreateValidator } from "common/models/score-model";
import { MUSIC_COUNTER_FIELD } from "./defs";

let contentCounterModel = new ContentCounterModel();
let musicModel = new ScoreModel();

export default async function createMusic(req, res, next) {
  try {
    const form = req.body;
    const { error, value } = ScoreModelCreateValidator.validate(form)
    if (error) {
      return next(new ErrorWithStatus(error.toString(), 400));
    }

    value.creator_id = req.userId;
    value.created_at = Date.now();
    value.updated_at = form.created_at;
    value.deleted_at = 0;
    value.status = 1;

    const { count: id } = await contentCounterModel.next(MUSIC_COUNTER_FIELD);

    value.id = id;
    await musicModel.put(musicModel.generateLowerCaseFields(value));

    res.json(value);
  } catch (ex) {
    next(new ErrorWithStatus(ex.toString(), 502));
  }
}
