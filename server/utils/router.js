import { Router } from "express";
import { findTrainer, findTrainers, upsertTrainer, delTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // TODO: 期待するレスポンスボディに変更する
    // const trainerNames = trainers.map(({ Key }) => Key.replace(/\.json$/, ""));
    const trainerNames = trainers.map(function (obj) {
      return obj["Key"].replace(/\.json$/, "")
    });
    res.send(trainerNames);
    res.send(trainers);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  console.log('トレーナーを追加');
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す
    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
// TODO: トレーナーを取得する API エンドポイントの実装
router.get("/trainer/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const trainer = await findTrainer(name);
    // console.log(trainer)
    res.send(trainer);
  } catch (err) {
    console.log(err);
    console.log("てすと2");
    next(err);
  }
});

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
router.post("/deleteTrainer", async (req, res, next) => {
  console.log('トレーナーを削除');
  try {
    // TODO: トレーナーが存在していなければ404を返す
    const result = await delTrainer(req.body.name);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの追加 */
router.put(
  "/trainer/:trainerName/pokemon/:pokemonName",
  async (req, res, next) => {
    console.log("つかまえよう");
    try {
      const { trainerName, pokemonName } = req.params;
      // const pokemon = await findPokemon(pokemonName);
      const trainer = await findTrainer(trainerName);
      // TODO: 削除系 API エンドポイントを利用しないかぎりポケモンは保持する
      trainer.pokemons.push({ id: "", nickname: "", name: pokemonName })
      // const result = await upsertTrainer(trainerName, { pokemons: [pokemon] });
      const result = await upsertTrainer(trainerName, trainer);
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
);

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装
router.delete(
  "/trainer/:trainerName/pokemon/:pokemonId",
  async (req, res, next) => {
    try {
      const { trainerName, pokemonId } = req.params;
      const trainer = await findTrainer(trainerName);
      const index = trainer.pokemons.findIndex(
        (pokemon) => String(pokemon.id) === pokemonId
      );
      trainer.pokemons.splice(index, 1);
      const result = await upsertTrainer(trainerName, trainer);
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      next(err);
    }
  }
);


export default router;
