import { ErrorWithStatus, ID_REQUIRED } from "common/config/errors";
import "common/utils/array-utils";
import { MusicModel } from "common/models/music-model";
import { MAX_BATCH_SIZE } from "./defs";

let musicModel = new MusicModel();

async function recoverBatch(ids: number[], creatorId: string) {
  const filteredItems = await musicModel.filterItemsByCreatorId(ids, creatorId);
  const result = await musicModel.batchUpdate(filteredItems, { deleted_at: 0 });
  return result;
}

export default async function recoverMusics(req, res, next) {
  try {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return next(ID_REQUIRED);
    }

    const chunks = ids.splitChunks(MAX_BATCH_SIZE);
    const data = await Promise.all(chunks.map((ids) => recoverBatch(ids, req.userId)));
    res.json({ data });
  } catch (ex) {
    next(new ErrorWithStatus(ex.toString(), 502));
  }
}
