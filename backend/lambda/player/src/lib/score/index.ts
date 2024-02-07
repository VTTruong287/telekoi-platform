import express from "express";

import createMusic from "./create-music";
import deleteMusics from "./delete-musics";
import recoverMusics from "./recover-musics";
import getMusic from "./get-music";
import queryMusics from "./query-musics";
import updateMusic from "./update-music";

const router = express.Router();

router.get("/query", queryMusics);
router.get("/:id", getMusic);

router.post("/delete", deleteMusics);
router.post("/recover", recoverMusics);
router.post("/:id", updateMusic);
router.put("/", createMusic);

export default router;
