import { ErrorWithStatus, FORBIDDEN, ID_REQUIRED } from "common/config/errors";
import { MusicModel } from "common/models/music-model";

let musicModel = new MusicModel();

export default async function getMusic(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(ID_REQUIRED);
    }

    const data = await musicModel.get(id);
    if (data.creator_id !== req.userId) {
      return next(FORBIDDEN);
    }

    res.json({ data });
  } catch (ex) {
    next(new ErrorWithStatus(ex.toString(), 502));
  }
}
