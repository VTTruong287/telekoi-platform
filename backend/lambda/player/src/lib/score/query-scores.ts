import { ErrorWithStatus } from "common/config/errors";
import { decodePageKey } from "common/utils/pagination";
import { MusicModel } from "common/models/music-model";

let musicModel = new MusicModel();

export default async function queryMusics(req, res, next) {
  try {
    const { page, items_per_page, search, filter_genre, filter_existence, page_key } = req.query;
    const pageKey = decodePageKey(page_key);

    const result = await musicModel.scan({
      pageKey,
      creatorId: req.userId,
      title: search,
      genre: filter_genre,
      existence: filter_existence,
      limit: parseInt(items_per_page)
    });

    res.json({ ...result, page: parseInt(page) });
  } catch (ex) {
    next(new ErrorWithStatus(ex.toString(), 502));
  }
}
