import express from "express";

import routeGames from "./games";
import routeAlbums from "./albums";
import routeMusics from "./musics";

const router = express.Router();

router.use("/game", routeGames);
router.use("/album", routeAlbums);
router.use("/music", routeMusics);

export default router;
