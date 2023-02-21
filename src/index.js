import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Logger from "koa-logger";
import serve from "koa-static";
import HttpStatus from "http-status";
import {getRandomPhotos} from "./unsplach.js";
import {apiHandler} from "./apiHandler.js";
import {errorHandler} from "./errorHandler.js";


const app = new Koa();

const PORT = process.env.PORT || 3000;

app.on('error', errorHandler);
app.use(BodyParser());
app.use(Logger());

app.use(serve("./public"));

const router = new Router();

router.get("/api/slides", apiHandler(async (ctx, next) => {
  ctx.status = HttpStatus.OK;
  ctx.body = await getRandomPhotos({count: 3, query: "toys"});
  await next();
}));

router.get("/api/products", apiHandler(async (ctx, next) => {
  ctx.status = HttpStatus.OK;
  ctx.body = (await getRandomPhotos({
    count: 8,
    query: "toys",
    orientation: "squarish",
    defaultDescription: "Product Name"
  })).map(p => ({
    name: p.description,
    price: Math.round((Math.random() * 89 + 10) * 100) / 100,
    picture_url: p.url
  }));
  await next();
}));

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, function () {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/",
    PORT,
    PORT
  );
});