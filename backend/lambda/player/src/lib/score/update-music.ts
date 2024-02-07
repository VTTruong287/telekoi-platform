import { ErrorWithStatus, ID_REQUIRED } from "common/config/errors";
import { MusicModel, MusicModelUpdateValidator } from "common/models/music-model";

let musicModel = new MusicModel();

export default async function updateMusic(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return next(ID_REQUIRED);
    }

    const form = req.body;

    const { error, value } = MusicModelUpdateValidator.validate(form, { presence: "optional" });
    if (error) {
      return next(new ErrorWithStatus(error.toString(), 400));
    }

    value.updated_at = Date.now();

    await musicModel.update({ id }, musicModel.generateLowerCaseFields(value), req.userId);

    res.json(value);
  } catch (ex) {
    next(new ErrorWithStatus(ex.toString(), 502));
  }
}
