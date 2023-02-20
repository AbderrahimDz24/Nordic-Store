import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Logger from "koa-logger";
import serve from "koa-static";
import * as nodeFetch from "node-fetch";
import HttpStatus from "http-status";
import {createApi} from "unsplash-js";

let UNSPLASH_ACCESS_KEY = getVarEnv("UNSPLASH_ACCESS_KEY");

const unsplashApi = createApi({
  accessKey: UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch.default,
});

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(BodyParser());
app.use(Logger());

app.use(serve("./public"));

const router = new Router();

router.get("/api/slides", async (ctx, next) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await getRandomPhotos();
    await next();
  } catch (e) {
    ctx.status = HttpStatus.BAD_GATEWAY;
    ctx.body = {
      error_message: e.message
    };
  }

  async function getRandomPhotos() {
    let res = await unsplashApi.photos.getRandom({
      count: 3,
      query: "toys",
      orientation: "landscape"
    });
    if (res?.errors?.length) {
      throw new Error(`Unsplash Api Errors: ${res.errors.join()}`)
    }
    return res.response.map((p) => ({
      description: p.description ?? p.alt_description ?? "",
      url: p.urls.full,
    }));
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, function () {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/",
    PORT,
    PORT
  );
});


function getVarEnv(name) {
  if (!process.env[name]) {
    throw Error(`The var env ${name} is not defined.`);
  }
  return process.env[name];
}